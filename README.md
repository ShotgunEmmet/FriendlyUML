# UML Diagram Maker

A modern, interactive web-based UML diagram creator with animated faces and a playful design. Create professional UML diagrams with a unique twist - each element has an expressive animated face!

## 🎯 Live Demo

**[Try the UML Diagram Maker Live](https://yourusername.github.io/FriendlyUML/)**

> ⚠️ **Setup Required**: Replace `yourusername` with your GitHub username after deploying to GitHub Pages. See the [Getting Started](#-getting-started) section below for deployment instructions.

## ✨ Features

### Diagram Elements
- **Class Diagrams** - Traditional rectangular classes
- **Interfaces** - Circular interface representations
- **Abstract Classes** - Diamond-shaped abstract elements
- **Enums** - Hexagonal enumeration types
- **Components** - Components with interface tabs
- **Packages** - Dashed containers for grouping elements
- **Nodes** - 3D cube-style deployment nodes
- **Databases** - Cylindrical database representations
- **Actors** - Stick figure actors for use cases
- **Notes** - Folded corner note elements

### Connection Types
- Association
- Dependency (dashed line)
- Aggregation (hollow diamond)
- Composition (filled diamond)
- Inheritance (hollow arrow)
- Realization (dashed with hollow arrow)
- Data Flow (solid arrow)
- Bidirectional (arrows on both ends)

### Interactive Features
- 🎭 **Animated Faces** - Each element has an animated face that blinks and moves
- 😢 **Emotional Responses** - Elements look sad when you hover over the delete button
- 😮 **Drag Expressions** - Elements show surprise when being dragged
- 🎨 **Customizable Colors** - Package elements can have custom colors
- 📦 **Nested Elements** - Drag elements into packages to group them
- 🔍 **Zoom Controls** - Zoom in/out from 25% to 200%
- ↩️ **Undo/Redo** - Full history support with keyboard shortcuts
- 📊 **Presentation Mode** - Hide UI elements for clean presentations
- 💾 **Save/Load** - Export and import diagrams as XML files

### User Interface
- Clean, modern design with soft pastel colors
- Intuitive drag-and-drop interface
- Real-time connection drawing
- In-place text editing
- Responsive zoom and pan controls

## 🚀 Getting Started

### Quick Start (GitHub Pages)

1. Fork or create a new repository with these files
2. Enable GitHub Pages:
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages** (in the left sidebar)
   - Under "Source", select **Deploy from a branch**
   - Choose **main** branch and **/ (root)** folder
   - Click **Save**
3. Wait 2-3 minutes for deployment
4. Your app will be available at:
   ```
   https://[your-github-username].github.io/[repository-name]/
   ```
   Example: `https://shotgunemmet.github.io/FriendlyUML/`

**Note:** Make sure your repository is public for GitHub Pages to work with the free tier.

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/FriendlyUML.git
cd FriendlyUML
```

2. Run a local web server (required for ES6 modules):

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node.js:**
```bash
npx http-server -p 8000
```

**Using VS Code:**
- Install "Live Server" extension
- Right-click on `index.html` → "Open with Live Server"

3. Open `http://localhost:8000` in your browser

## 📁 Project Structure

```
FriendlyUML/
├── index.html              # Main HTML file
├── css/
│   ├── styles.css         # Base styles
│   └── components.css     # UI component styles
└── js/
    ├── main.js            # Application entry point
    ├── constants/
    │   ├── types.js       # Element and connection type constants
    │   └── colors.js      # Color palette constants
    ├── models/
    │   ├── Element.js     # Base element class
    │   ├── Connection.js  # Connection model
    │   ├── ElementFactory.js
    │   └── elements/      # Specific element type classes
    ├── managers/
    │   ├── StateManager.js    # Application state management
    │   ├── CanvasManager.js   # SVG canvas rendering
    │   ├── EventManager.js    # User interaction handling
    │   └── AnimationManager.js # Face animations
    ├── components/        # UI components
    ├── renderers/         # Element and connection renderers
    └── utils/            # Helper utilities
```

## 🛠️ Technologies Used

- **Vanilla JavaScript (ES6+)** - No frameworks, pure JavaScript with modern features
- **SVG** - Scalable Vector Graphics for diagram rendering
- **CSS3** - Modern styling with animations and transitions
- **ES6 Modules** - Clean, modular code architecture
- **Object-Oriented Design** - Inheritance-based element system

## 🌐 Browser Compatibility

The application works in all modern browsers that support ES6 modules:
- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 79+

**Note:** Internet Explorer is not supported.

## 🎮 Usage Tips

### Keyboard Shortcuts
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Y` - Redo
- `Mouse Wheel` - Zoom in/out

### Creating Diagrams
1. Click element buttons in the toolbar to add elements
2. Click on element names to edit them (supports multi-line with Enter)
3. Click "Connect" then click two elements to connect them
4. Click on connection labels to add descriptions
5. Drag elements into packages to group them
6. Use the faces toggle to show/hide animated faces

### Saving Your Work
- Click "Save" to download your diagram as an XML file
- Click "Load" to import a previously saved diagram

## 📚 Example: Creating a Simple Class Diagram

1. **Add Classes**: Click "Add Class" button three times to create three classes
2. **Name Classes**: 
   - Click on first class name, type "Animal"
   - Click on second class name, type "Dog"
   - Click on third class name, type "Cat"
3. **Arrange**: Drag classes to position them (Animal on top, Dog and Cat below)
4. **Connect with Inheritance**:
   - Click "Connect" button
   - Select "Inheritance" from the connection type menu
   - Click on "Dog" class, then click on "Animal" class
   - Click on "Cat" class, then click on "Animal" class
5. **Add Package** (Optional):
   - Click "Add Package"
   - Drag it to surround all classes
   - Click package name, type "Animals"
   - Click the color circle to customize package color
6. **Save**: Click "Save" and name your diagram

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by traditional UML diagramming tools
- Face animations add a playful twist to professional diagramming
- Built with modern web standards for maximum compatibility

## 🐛 Troubleshooting

### CORS Error When Opening index.html Directly
If you see: `Access to script at 'file:///...' from origin 'null' has been blocked by CORS policy`

**Solution:** You must run a local web server. See [Local Development](#local-development) section above.

### GitHub Pages Not Working
- Ensure your repository is **public**
- Check that GitHub Pages is enabled in Settings → Pages
- Wait 2-10 minutes after enabling (first deployment can be slow)
- Clear your browser cache
- Check the Actions tab for deployment status

### Elements Not Showing Faces
- Click the "Hide Faces" / "Show Faces" toggle button
- Refresh the page if animations seem stuck

### Can't Save/Load Diagrams
- Check that your browser allows file downloads
- Ensure pop-ups aren't blocked (for save dialog)
- Try a different browser if issues persist

## 🚧 Roadmap / Future Features

- [ ] Export to PNG/SVG image formats
- [ ] Export to PlantUML format
- [ ] Collaborative editing (real-time sharing)
- [ ] More UML diagram types (Sequence, Activity, Use Case)
- [ ] Element templates/libraries
- [ ] Dark mode
- [ ] Touch device support
- [ ] Keyboard shortcuts for adding elements
- [ ] Auto-layout algorithms
- [ ] Import from PlantUML

## 📸 Screenshots

### Main Interface
![UML Diagram Maker Interface](screenshots/interface.png)

### Sample Diagram
![Sample UML Diagram](screenshots/sample-diagram.png)

### Presentation Mode
![Presentation Mode](screenshots/presentation-mode.png)

*(Add screenshots to a `screenshots/` folder in your repository)*

---

Made with ❤️ and animated faces 🎭