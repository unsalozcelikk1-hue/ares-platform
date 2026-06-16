# Use lightweight python 3.9 base image
FROM python:3.9-slim

# Set working directory inside container
WORKDIR /app

# Copy frontend static files
COPY index.html style.css app.js ./

# Copy property images
COPY assets/ ./assets/

# Copy backend scripts
COPY backend/ ./backend/

# Expose server port
EXPOSE 5050

# Run python server
CMD ["python", "backend/server.py"]
