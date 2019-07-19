<?php declare(strict_types = 1);

use Contributte\Utils\Strings;
use Dockette\Rendertron\Tracer\Tracer;
use Tracy\Debugger;

require __DIR__ . '/../vendor/autoload.php';

// Start awesome Tracy!
Debugger::enable(
	getenv('NETTE_DEBUG') === '1' ? Debugger::DEVELOPMENT : Debugger::PRODUCTION,
	__DIR__ . '/../var'
);

// Fetch all ENV(s)s
$env = getenv();

// Setup tracer
$tracer = new Tracer([
	'server' => $env['TRACER_SERVER'] ?? 'http://localhost:4000/render/',
]);

foreach ($env as $key => $value) {
	if (Strings::startsWith($key, 'TRACER_SRC_SITEMAP')) {
		$tracer->addResourceSitemap($value);
	}
}

$tracer->run();
