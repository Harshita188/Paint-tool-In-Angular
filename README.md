# Angular Paint Tool

## Description
Angular Paint Tool is a lightweight and interactive web-based drawing application built using Angular. It provides a simple yet powerful interface for users to create, edit, and save digital drawings. The application supports various brush styles, colors, and shapes, making it an ideal tool for sketching and quick designs.

## Features
- **Canvas Drawing** – Draw freehand sketches on a flexible canvas.
- **Brush Customization** – Adjust brush size and color.
- **Shape Tools** – Add predefined shapes like rectangles, circles, and lines.
- **Erase Tool** – Erase specific portions of your drawing.
- **Undo/Redo** – Step backward and forward through changes.
- **Save to IndexedDB** – Store drawings locally in the browser using IndexedDB.
- **Export as Image** – Download your artwork as an image file.
- **Clear Canvas** – Reset the drawing area with one click.

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/angular-paint-tool.git
   ```
2. Navigate to the project directory:
   ```sh
   cd angular-paint-tool
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Run the development server:
   ```sh
   ng serve
   ```
5. Open your browser and go to `http://localhost:4200/` to start using the paint tool.

## Usage
1. Select a brush or shape from the toolbar.
2. Customize the brush size and color.
3. Draw on the canvas.
4. Save your work to IndexedDB or export it as an image.
5. Reload the page to retrieve saved drawings.

## Saving to IndexedDB
The tool automatically saves your drawings in IndexedDB so that they persist even after refreshing the page. Users can retrieve their last saved drawing when they return.

## Technologies Used
- Angular
- TypeScript
- HTML5 Canvas API
- IndexedDB
- SCSS for styling

## Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue for improvements.

## License
This project is licensed under the MIT License.

---
### Screenshot
![image](https://github.com/user-attachments/assets/fd2913cd-267d-40a3-82f4-8635ecb659c0)


