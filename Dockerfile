# Use an official Python runtime as a parent image
FROM python:3

# Set the working directory in the container
WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
# Copy the current directory contents into the container at /usr/src/app
COPY . .



# Run script.py when the container launches
CMD ["python", "py.py"]