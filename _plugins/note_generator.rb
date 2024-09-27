module Jekyll
  class NoteGenerator

    @@note_id_counter = 0  # Initialize a class variable to track note IDs
    # Register the post_render hook for both pages and posts
    Jekyll::Hooks.register [:pages, :posts], :post_render do |page|
      if page.path.end_with? '.md'
        if page.output  # Ensure output exists and is not nil
          page.output = process_notes(page)
        end
      end
    end

    def self.process_notes(page)
      content = page.output
      return content unless content  # Ensure content is not nil

      # Find the %$...$% notes using regex in the HTML output
      content.gsub!(/%\$[\s\S]*?\$%/) do |note|
        note_text = escape_special_characters(note[2..-3])

        # Increment the counter and create a unique ID for the note
        note_id = "note-#{@@note_id_counter}"
        @@note_id_counter += 1

        note_html = "<span class='note' id='#{note_id} 'data-note-text='#{note_text}'></span>"
        puts "Found note: #{note_text} in #{page.path}"  # Debug output

        note_html
      end

      content.gsub!(/<p\b[^>]*>/) do |tag|
        replace = tag + "<span>"
        replace
      end

      content.gsub!(/<\/p\s*>/) do |tag|
        replace = "</span>" + tag
        replace
      end

      content.gsub!(/<li\b[^>]*>/) do |tag|
        replace = tag + "<span>"
        replace
      end

      content.gsub!(/<\/li\s*>/) do |tag|
        replace = "</span>" + tag
        replace
      end
    end

    def self.escape_special_characters(text)
      CGI.escapeHTML(text)
    end
  end
end