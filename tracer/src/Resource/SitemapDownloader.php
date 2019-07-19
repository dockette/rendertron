<?php declare(strict_types = 1);

namespace Dockette\Rendertron\Tracer\Resource;

use GuzzleHttp\Client;

final class SitemapDownloader implements Downloader
{

	/** @var Client */
	private $client;

	/** @var string */
	private $url;

	public function __construct(Client $client, string $url)
	{
		$this->client = $client;
		$this->url = $url;
	}

	public function download(): array
	{
		$res = $this->client->request('GET', $this->url);
		$xml = simplexml_load_string($res->getBody()->getContents());
		$urls = [];

		foreach ($xml->url as $node) {
			$urls[] = $node->loc->__toString();
		}

		return $urls;
	}

}