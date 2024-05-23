import threading
import time
from collections import defaultdict
from typing import DefaultDict
import mysql.connector
from db_utils import get_db_connection
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)


class LikeBatcher:
    def __init__(self, flush_interval: int = 10, batch_size: int = 10):
        # Initialize the LikeBatcher with specified flush interval and batch size.
        self.likes: DefaultDict[int, int] = defaultdict(int)  # Dictionary to store likes count for each post
        self.lock = threading.Lock()  # Lock for thread safety
        self.flush_interval = flush_interval  # Time interval to flush likes
        self.batch_size = batch_size  # Number of likes to accumulate before flushing
        self.stop_event = threading.Event()  # Event to signal stopping the thread
        self.thread = threading.Thread(target=self._flush_likes_periodically)  # Thread for periodic flushing
        self.thread.start()  # Start the thread

    def add_like(self, post_id: int):
        # Add a like to a post and flush if the batch size is reached.
        with self.lock:  # Ensure thread safety
            self.likes[post_id] += 1  # Increment the like count for the post
            logging.info(f"Added like for post_id: {post_id}. Total likes for this post: {self.likes[post_id]}")
            if len(self.likes) >= self.batch_size:  # Check if batch size is reached
                logging.info("Batch size reached, flushing likes.")
                self._flush_likes()  # Flush likes to the database

    def _flush_likes(self):
        # Flush the accumulated likes to the database.
        with self.lock:  # Ensure thread safety
            if not self.likes:  # Return if no likes to flush
                return

            connection = get_db_connection()  # Get a database connection
            cursor = connection.cursor()
            try:
                for post_id, like_count in self.likes.items():  # Update likes for each post
                    cursor.execute(
                        "UPDATE posts SET likes = likes + %s WHERE post_id = %s",
                        (like_count, post_id),
                    )
                    logging.info(f"Flushed {like_count} likes for post_id: {post_id}.")
                connection.commit()  # Commit the transaction
                logging.info("Flushed likes to the database.")
                self.likes.clear()  # Clear the likes dictionary
            except mysql.connector.Error as err:  # Handle any database errors
                logging.error(f"Error: {err}")
            finally:
                cursor.close()  # Close the cursor
                connection.close()  # Close the connection

    def _flush_likes_periodically(self):
        # Periodically flush likes to the database based on the flush interval.
        while not self.stop_event.is_set():  # Run until stop event is set
            time.sleep(self.flush_interval)  # Wait for the flush interval
            logging.info("Periodic flush.")
            self._flush_likes()  # Flush likes to the database

    def stop(self):
        # Stop the periodic flushing and ensure any remaining likes are flushed.
        self.stop_event.set()  # Set the stop event
        self.thread.join()  # Wait for the thread to finish
        self._flush_likes()  # Flush any remaining likes


# Create an instance of LikeBatcher
like_batcher = LikeBatcher()
