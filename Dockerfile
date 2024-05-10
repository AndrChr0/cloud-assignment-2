# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /usr/src/app

RUN pip freeze > requirements.txt .
# Copy the current directory contents into the container at /usr/src/app
COPY py.py .

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Run script.py when the container launches
CMD ["python", "py.py"]