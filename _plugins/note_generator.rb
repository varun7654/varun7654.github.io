module Jekyll
  class NoteGenerator

    @@note_id_counter = 0  # Initialize a class variable to track note IDs
    # Register the post_render hook for both pages and posts
    Jekyll::Hooks.register [:pages, :posts], :post_render do |page|
      # puts "post render #{page.path}"

      if page.output  # Ensure output exists and is not nil
        page.output = process_notes(page.output)
      end
    end

    # Define the process_notes method as a class method
    def self.process_notes(content)
      return content unless content  # Ensure content is not nil

      # Find the %$...$% notes using regex in the HTML output
      content.gsub(/%\$[\s\S]*?\$%/) do |note|
        note_text = escape_special_characters(note[2..-3])

        # Increment the counter and create a unique ID for the note
        note_id = "note-#{@@note_id_counter}"
        @@note_id_counter += 1

        note_html = "<span class='note' id='#{note_id} 'data-note-text='#{note_text}'></span>"
        puts "Found note: #{note_html}"  # Debug output

        note_html
      end
    end

    def self.escape_special_characters(text)
      CGI.escapeHTML(text)
    end
  end
end