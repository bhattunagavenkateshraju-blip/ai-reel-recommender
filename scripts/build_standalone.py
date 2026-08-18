"""
Standalone Single-File HTML Packager
Bundles HTML, CSS, and JS modules into a single zero-dependency portable HTML file.
"""

import os
import sys
import re

if sys.platform == "win32":
  sys.stdout.reconfigure(encoding='utf-8')

def build_standalone():
  base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
  dist_dir = os.path.join(base_dir, "dist")
  os.makedirs(dist_dir, exist_ok=True)

  index_html_path = os.path.join(base_dir, "index.html")
  styles_css_path = os.path.join(base_dir, "css", "styles.css")
  
  js_files = [
    os.path.join(base_dir, "js", "dataset.js"),
    os.path.join(base_dir, "js", "agent.js"),
    os.path.join(base_dir, "js", "gemini-service.js"),
    os.path.join(base_dir, "js", "trap-analyzer.js"),
    os.path.join(base_dir, "js", "ui-radar.js"),
    os.path.join(base_dir, "js", "ui-feed.js"),
    os.path.join(base_dir, "js", "app.js")
  ]

  with open(index_html_path, "r", encoding="utf-8") as f:
    html = f.read()

  with open(styles_css_path, "r", encoding="utf-8") as f:
    css = f.read()

  # Read and combine JS, stripping export/import statements for single bundle
  combined_js = []
  for js_path in js_files:
    with open(js_path, "r", encoding="utf-8") as f:
      code = f.read()
      # Strip import statements
      code = re.sub(r'^\s*import\s+.*?;\s*$', '', code, flags=re.MULTILINE)
      # Strip export keywords
      code = re.sub(r'\bexport\s+(class|const|let|var|function)\b', r'\1', code)
      # Strip export default
      code = re.sub(r'^\s*export\s+default\s+.*?;', '', code, flags=re.MULTILINE)
      combined_js.append(code)

  all_js = "\n\n".join(combined_js)

  # Replace CSS link with inline <style>
  html = re.sub(
    r'<link\s+rel="stylesheet"\s+href="css/styles\.css">',
    f'<style>\n{css}\n</style>',
    html
  )

  # Replace module script tags with single inline script
  html = re.sub(
    r'<script\s+type="module"\s+src="js/.*?"></script>\s*',
    '',
    html
  )

  # Insert bundled script before </body>
  script_tag = f"<script>\n(function() {{\n{all_js}\n}})();\n</script>\n</body>"
  html = html.replace("</body>", script_tag)

  output_path = os.path.join(dist_dir, "standalone.html")
  with open(output_path, "w", encoding="utf-8") as f:
    f.write(html)

  print(f"✓ Standalone single-file bundle built successfully: {output_path} ({len(html)} bytes)")

if __name__ == "__main__":
  build_standalone()
