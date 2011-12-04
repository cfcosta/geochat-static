require 'bundler/setup'
Bundler.require

class Application < Sinatra::Application
  get('/') { erb :index }
end

run Application
