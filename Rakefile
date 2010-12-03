prefix    = File.dirname( __FILE__ )

# Directory variables
src_dir   = File.join( prefix, 'src' )
build_dir = File.join( prefix, 'build' )
test_dir  = File.join( prefix, 'test' )

# A different destination directory can be set by
# setting DIST_DIR before calling rake
dist_dir  = ENV['DIST_DIR'] || File.join( prefix, 'dist' )

base_files = %w{base_cjk}.map { |js| File.join( src_dir, "#{js}.js" ) }

basecjk      = File.join( dist_dir, "base_cjk.js" )
basecjk_min  = File.join( dist_dir, "base_cjk.min.js" )

# General Variables
date       = `git log -1`[/^Date:\s+(.+)$/, 1]
version    = File.read( File.join( prefix, 'VERSION' ) ).strip

# Build tools
rhino      = "java -jar #{build_dir}/js.jar"
minfier    = "java -jar #{build_dir}/google-compiler-20100917.jar"

# Turn off output other than needed from `sh` and file commands
verbose(false)

# Tasks
task :default => "all"

desc "Builds BaseCJK; Tests with JSLint; Minifies BaseCJK"
task :all => [:lint, :min] do
  puts "BaseCJK build complete."
end

desc "Builds a minified version of BaseCJK: base_cjk.min.js"
task :min => basecjk_min

desc "Removes dist folder"
task :clean do
  puts "Removing Distribution directory: #{dist_dir}..."
  rm_rf dist_dir
end

desc "Tests built basecjk.js against JSLint"
task :lint => basecjk do
  puts "Checking BaseCJK against JSLint..."
  sh "#{rhino} " + File.join(build_dir, 'jslint-check.js')
end

# File and Directory Dependencies
directory dist_dir

file basecjk => [dist_dir, base_files].flatten do
  puts "Building base_cjk.js..."

  File.open(basecjk, 'w') do |f|
    f.write cat(base_files).gsub(/(Date:.)/, "\\1#{date}" ).gsub(/@VERSION/, version)
  end
end

file basecjk_min => basecjk do
  puts "Building base_cjk.min.js..."

  sh "#{minfier} --js #{basecjk} --warning_level QUIET --js_output_file #{basecjk_min}"

  min = File.read( basecjk_min )

  # Equivilent of "head"
  File.open(basecjk_min, 'w') do |f|
    f.write File.readlines(basecjk)[0..14].join()
    f.write min
  end
end

def cat( files )
  files.map do |file|
    File.read(file)
  end.join('')
end
