<?php declare(strict_types = 1);

namespace Dockette\Rendertron\Tracer\Resource;

final class UrlCollector
{

	/** @var Downloader[] */
	private $downloaders = [];

	public function addDownloader(Downloader $downloader): void
	{
		$this->downloaders[] = $downloader;
	}

	public function collect(): array
	{
		$urls = [];

		foreach ($this->downloaders as $downloader) {
			$urls += $downloader->download();
		}

		return $urls;
	}

}