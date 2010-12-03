require 'rubygems'
require 'sinatra'
TEST_ROOT = File.dirname(__FILE__)

get '/' do
  File.read(TEST_ROOT + '/index.html')
end
