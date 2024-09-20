module Jekyll
  class TypeScriptCompiler < Jekyll::Generator
    safe true

    def generate(site)
      puts "Running TypeScript Compiler..."
      unless system("npx tsc")
        if ENV['JEKYLL_ENV'] == 'production'
          raise "TypeScript compilation failed. Aborting Jekyll build."
        else
          puts "TypeScript compilation failed."
        end
      end
      puts "TypeScript compilation completed."
    end
  end
end
