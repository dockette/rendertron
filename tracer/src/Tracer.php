<?php declare(strict_types = 1);

namespace Dockette\Rendertron\Tracer;

use Dockette\Rendertron\Tracer\Resource\SitemapDownloader;
use Dockette\Rendertron\Tracer\Resource\SitemapListDownloader;
use Dockette\Rendertron\Tracer\Resource\UrlCollector;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Pool;
use GuzzleHttp\Psr7\Request;
use Psr\Http\Message\ResponseInterface;
use Tracy\Debugger;

final class Tracer
{

	/** @var UrlCollector */
	private $collector;

	/** @var Client */
	private $client;

	/** @var mixed[] */
	private $clientOptions = [
		'http_errors' => FALSE,
	];

	/** @var mixed[] */
	private $options = [
		'server' => 'http://localhost:4000/render/',
		'concurrency' => 5,
	];

	/** @var mixed[] */
	private $resources = [
		'sitemaps' => [],
		'sitemaps_lists' => [],
	];

	public function __construct(array $options)
	{
		$this->options = array_merge($this->options, $options);
	}

	public function addResourceSitemap(string $url): void
	{
		$this->resources['sitemaps'][] = $url;
	}

	public function addResourceSitemapList(string $url): void
	{
		$this->resources['sitemaps_lists'][] = $url;
	}

	public function run(): void
	{
		$urls = $this->getUrlCollector()->collect();

		Debugger::dump(sprintf('Collector collected "%d" URLs', count($urls)));

		$requests = function () use ($urls) {
			foreach ($urls as $url) {
				$endpoint = sprintf(
					'%s/%s',
					rtrim($this->options['server'], '/'),
					$url
				);

				Debugger::dump(sprintf('Trigger: yielding [%s]', $endpoint));

				yield $url => new Request('GET', $endpoint);
			}
		};

		$pool = new Pool($this->getHttpClient(), $requests(), [
			'concurrency' => $this->options['concurrency'],
			'fulfilled' => function (ResponseInterface $response, $index) {
				Debugger::dump(sprintf('Trigger: success [%s] status %s', $index, $response->getStatusCode()));
			},
			'rejected' => function (RequestException $reason, $index) {
				Debugger::dump(sprintf('Trigger: failed [%s] status %s', $index, $reason->getMessage()));
			},
		]);

		$promise = $pool->promise();
		$promise->wait();
	}

	private function getUrlCollector(): UrlCollector
	{
		if (!$this->collector) {
			$this->collector = new UrlCollector();

			foreach ($this->resources['sitemaps_lists'] as $list) {
				Debugger::dump(sprintf('Collector: sitemap list [%s]', $list));
				$this->collector->addDownloader(new SitemapListDownloader($this->getHttpClient(), $list));
			}

			foreach ($this->resources['sitemaps'] as $sitemap) {
				Debugger::dump(sprintf('Collector: sitemap [%s]', $sitemap));
				$this->collector->addDownloader(new SitemapDownloader($this->getHttpClient(), $sitemap));
			}
		}

		return $this->collector;
	}

	private function getHttpClient(): Client
	{
		if (!$this->client) {
			$this->client = new Client($this->clientOptions);
		}

		return $this->client;
	}

}