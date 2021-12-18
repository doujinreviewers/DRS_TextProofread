import * as fs from 'fs';
import * as path from 'path';
import { nanoid } from 'nanoid'
import prebundlejs from './assets/DRS_TextProofread.prebundleapp';

let app_html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Vue app</title>
  </head>
  <body>
    <div id="app"></div>
    <script>${prebundlejs}</script>
  </body>
</html>
`
const html_filename = "DRS_TextProofread_"+nanoid()+".html";
fs.writeFileSync(path.join(process.cwd(), html_filename), app_html);
nw.Window.open(html_filename, {}, function(win) {
  win.width = 1280;
  win.height = 800;
  win.on('close', function () {
    try {
      fs.unlinkSync(path.join(process.cwd(), html_filename));
    } catch (e) {
      console.log(e);
    } finally {
      this.close(true);
    }
  });
})