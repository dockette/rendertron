<?php declare(strict_types = 1);

use Dockette\Rendertron\Tracer\Resource\SitemapDownloader;
use Dockette\Rendertron\Tracer\Resource\SitemapListDownloader;
use Dockette\Rendertron\Tracer\Resource\UrlCollector;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use Tester\Assert;

require_once __DIR__ . '/../bootstrap.php';

test(function (): void {
	$mock = new MockHandler([
		new Response(200, [], file_get_contents(__DIR__ . '/../fixtures/sitemap1.xml')),
	]);

	$client = new Client(['handler' => HandlerStack::create($mock)]);
	$downloader = new SitemapDownloader($client, 'https://dockette.org/sitemap.xml');

	$collector = new UrlCollector();
	$collector->addDownloader($downloader);

	$collected = $collector->collect();
	Assert::count(2, $collected);
	Assert::equal('https://dockette.org/foo', $collected[0]);
	Assert::equal('https://dockette.org/bar', $collected[1]);
});

test(function (): void {
	$mock = new MockHandler([
		new Response(200, [], file_get_contents(__DIR__ . '/../fixtures/sitemap_list.xml')),
		new Response(200, [], file_get_contents(__DIR__ . '/../fixtures/sitemap1.xml')),
		new Response(200, [], file_get_contents(__DIR__ . '/../fixtures/sitemap2.xml')),
	]);

	$client = new Client(['handler' => HandlerStack::create($mock)]);
	$downloader = new SitemapListDownloader($client, 'https://dockette.org/sitemap_list.xml');

	$collector = new UrlCollector();
	$collector->addDownloader($downloader);

	$collected = $collector->collect();
	Assert::count(4, $collected);
	Assert::equal('https://dockette.org/foo', $collected[0]);
	Assert::equal('https://dockette.org/bar', $collected[1]);
	Assert::equal('https://dockette.org/foo-foo', $collected[2]);
	Assert::equal('https://dockette.org/bar-bar', $collected[3]);
});
