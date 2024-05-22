import threading
import time
from collections import defaultdict
import mysql.connector
from db_utils import get_db_connection
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)

class LikeBatcher:
    def __init__(self, flush_interval: int = 10, batch_size: int = 10):
        self.likes = defaultdict(int)
        self.lock = threading.Lock()
        self.flush_interval = flush_interval
        self.batch_size = batch_size
        self.stop_event = threading.Event()
        self.thread = threading.Thread(target=self._flush_likes_periodically)
        self.thread.start()

    def add_like(self, post_id: int):
        with self.lock:
            self.likes[post_id] += 1
            logging.info(f"Added like for post_id: {post_id}. Total likes for this post: {self.likes[post_id]}")
            if len(self.likes) >= self.batch_size:
                logging.info("Batch size reached, flushing likes.")
                self._flush_likes()

    def _flush_likes(self):
        with self.lock:
            if not self.likes:
                return

            connection = get_db_connection()
            cursor = connection.cursor()
            try:
                for post_id, like_count in self.likes.items():
                    cursor.execute(
                        "UPDATE posts SET likes = likes + %s WHERE post_id = %s",
                        (like_count, post_id),
                    )
                    logging.info(f"Flushed {like_count} likes for post_id: {post_id}.")
                connection.commit()
                logging.info("Flushed likes to the database.")
                self.likes.clear()
            except mysql.connector.Error as err:
                logging.error(f"Error: {err}")
            finally:
                cursor.close()
                connection.close()

    def _flush_likes_periodically(self):
        while not self.stop_event.is_set():
            time.sleep(self.flush_interval)
            logging.info("Periodic flush.")
            self._flush_likes()

    def stop(self):
        self.stop_event.set()
        self.thread.join()
        self._flush_likes()

like_batcher = LikeBatcher()
