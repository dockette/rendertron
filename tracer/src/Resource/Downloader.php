<?php declare(strict_types = 1);

namespace Dockette\Rendertron\Tracer\Resource;

interface Downloader
{

	public function download(): array;

}