build:
	docker build -t dockette/rendertron .

run:
	docker run -it --rm -p 3000:3000 dockette/rendertron
