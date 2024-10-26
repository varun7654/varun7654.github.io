require 'find'

module Jekyll
  class Utf8Checker < Jekyll::Generator
    def generate(site)
      directory_to_search = "./"
      puts "Running UTF-8 check in #{directory_to_search}..."

      # Define text-based file extensions to check
      text_extensions = %w[.html .css .js .md .txt .xml .json .yml]

      # Check each file in the directory
      Find.find(directory_to_search) do |path|
        next if File.directory?(path)
        next unless text_extensions.include?(File.extname(path).downcase)
        next if path.include?('.git') # Skip git files

        unless valid_utf8?(path)
          Jekyll.logger.warn "Invalid UTF-8 encoding in file:", path
        end
      end
      puts "UTF-8 check completed."
    end

    private

    # Function to verify UTF-8 encoding
    def valid_utf8?(file_path)
      File.read(file_path, encoding: 'UTF-8').valid_encoding?
    rescue ArgumentError
      false
    end
  end
end
