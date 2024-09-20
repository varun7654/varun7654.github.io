module Jekyll
  class TypeScriptCompiler < Jekyll::Generator
    safe true

    def generate(site)
      puts "Running TypeScript Compiler..."
      unless system("npx tsc")
        raise "TypeScript compilation failed. Aborting Jekyll build."
      end
      puts "TypeScript compilation completed."
    end
  end
end
