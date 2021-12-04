@extends('layouts.app')

@section('content')
    @if (!auth()->user()->token)
        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 bg-white border-b border-gray-200">
                        @if (session('status'))
                            <div class="alert alert-success" role="alert">
                                {{ session('status') }}
                            </div>
                        @endif

                        <div>You don't have a token yet, you can start the Authorize from Salla</div>
                        <div class="mt-4">
                            <a href="{{ route('oauth.redirect') }}"
                               class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Get
                                Access Token</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    @else
        @php /** @var \Salla\OAuth2\Client\Provider\SallaUser $store **/ @endphp
        <div class="container mx-auto my-1">
            <div class="md:flex no-wrap md:-mx-2 ">
                <!-- Left Side -->
                <div class="w-full md:w-3/12 md:mx-2">

                    <div class="card text-center shadow-2xl">
                        <figure class="">
                            <img src="{{ $store->getStoreAvatar() }}" class="rounded-xl">
                        </figure>
                        <div class="card-body">
                            <h2 class="card-title">
                                <a href="https://salla.sa/{{ $store->getStoreUsername() }}"
                                   class="mb-0 font-weight-bold">{{ $store->getName() }}
                                    ({{ ucfirst($store->getStorePlan()) }})</a>
                            </h2>
                            <ul class="text-left">
                                <li>Name: {{ $store->getStoreUsername() }}</li>
                                <li>Store ID: {{ $store->getStoreId() }}</li>
                                <li>Owner ID: {{ $store->getStoreOwnerID() }}</li>
                                <li>Email: {{ $store->getEmail() }}</li>
                                <li>Status: {{ $store->getStoreStatus() }}</li>
                            </ul>
                            <div class="justify-center card-actions">
                                <a href="https://salla.sa/{{ $store->getStoreUsername() }}"
                                   class="btn btn-outline btn-accent">Visit Store</a>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Right Side -->
                <div class="w-full md:w-9/12 mx-2 h-64">
                    <div class="overflow-x-auto card">
                        <table class="table w-full table-borderless">
                            <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach ($products as $product)
                                <tr>
                                    <td>
                                        <div class="flex items-center space-x-3">
                                            <div class="avatar">
                                                <div class="w-12 h-12 mask mask-squircle">
                                                    <img src="{{ $product['images'][0]['url'] }}">
                                                </div>
                                            </div>
                                            <div>
                                                <div class="font-bold">
                                                    {{ $product['name'] }}
                                                </div>
                                                <div class="text-sm opacity-50">
                                                    SKU: {{ $product['sku'] }}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {{ $product['price']['amount'] }} {{  $product['price']['currency'] }}
                                    </td>
                                    <td>{{ ucfirst($product['status']) }}</td>
                                    <th>
                                        <a href="{{ $product['urls']['admin'] }}"
                                           class="btn btn-ghost btn-xs">Dashboard</a>
                                        <a href="{{ $product['urls']['customer'] }}"
                                           class="btn btn-ghost btn-xs">Details</a>
                                    </th>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    @endif
@endsection
