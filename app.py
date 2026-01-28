from .application import App


print("> === Flask Server === <")


if __name__ == "__main__":
    application = App()
    application.create_app()
    application.run()
