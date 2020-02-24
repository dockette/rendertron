<?php declare(strict_types = 1);

namespace Dockette\Rendertron\Tracer\Resource;

use GuzzleHttp\Client;

final class SitemapListDownloader implements Downloader
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

		// Collect all sitemap lists
		$lists = [];
		foreach ($xml->sitemap as $node) {
			$lists[] = $node->loc->__toString();
		}

		// Collect all urls from sitemap list
		$urls = [];
		foreach ($lists as $list) {
			array_push($urls, ...(new SitemapDownloader($this->client, $list))->download());
		}

		// Uniqueness
		$urls = array_unique($urls);

		return $urls;
	}

}