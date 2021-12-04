<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;

class NgrokMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string[]  ...$guards
     *
     * @return mixed
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public function handle($request, Closure $next)
    {
        if (!app()->isLocal()) {
            return $next($request);
        }

        $host = $this->extractOriginalHost($request);
        $scheme = $this->extractOriginalScheme($request);

        if (!$this->isNgrokHost($host)) {
            return $next($request);
        }

        if ($scheme === 'http') {
            return redirect()->secure($request->getRequestUri());
        }

        $urlGenerator = app()->make('url');
        $urlGenerator->forceScheme($scheme);
        $urlGenerator->forceRootUrl($scheme.'://'.$host);

        Paginator::currentPathResolver(function () use ($urlGenerator, $request) {
            return $urlGenerator->to($request->path());
        });

        return $next($request);
    }


    /**
     * Extract the original scheme from the request.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return string
     */
    private function extractOriginalScheme(Request $request): string
    {
        if ($request->hasHeader('x-forwarded-proto')) {
            $scheme = $request->header('x-forwarded-proto');
        } else {
            $scheme = $request->getScheme();
        }

        return $scheme;
    }

    /**
     * Extract the original host from the request.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return string
     */
    private function extractOriginalHost(Request $request): string
    {
        if ($request->hasHeader('x-original-host')) {
            $host = $request->header('x-original-host');
        } else {
            $host = $request->getHost();
        }

        return $host;
    }

    /**
     * Check if the host from ngrok.
     *
     * @param  string  $host
     *
     * @return bool
     */
    private function isNgrokHost(string $host): bool
    {
        return preg_match('/(.*)\.ngrok\.io$/i', $host);
    }
}
