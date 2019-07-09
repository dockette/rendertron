build:
	docker build -t dockette/rendertron .

build-proxy:
	docker build -t dockette/rendertron-proxy ./proxy

run:
	docker run \
		-it \
		--rm \
		-p 3000:3000 \
		dockette/rendertron

run-proxy:
	docker run \
		-it \
		--rm \
		-p 4000:4000 \
		-v $(CURDIR)/tmp:/data \
		-e NGINX_PROXY=http://host.docker.internal:3000 \
		dockette/rendertron-proxy
