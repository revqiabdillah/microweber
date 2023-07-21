

@include('admin::layouts.partials.header',[
    'disableTopBar' => true,
    'disableNavBar' => true,
])

@hasSection('content')
    <main class="module-main-holder">
        @yield('content' )
    </main>
@endif


@include('admin::layouts.partials.footer')
