<?php

namespace Controller;

class App extends \Prefab
{
    public function get_serve($f3)
    {
        return \View\ReactApp::render();
    }
}
