from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

#docker-compose down

#docker-compose up --build

#http://localhost:15672 -guest
