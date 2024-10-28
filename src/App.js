import React, { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-preset-newsletter';
import 'grapesjs-plugin-export';

const EmailTemplateDesigner = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    // Initialize GrapesJS editor
    const editor = grapesjs.init({
      container: editorRef.current,
      height: '100vh',
      width: 'auto',
      plugins: ['grapesjs-preset-newsletter', 'grapesjs-plugin-export'],
      pluginsOpts: {
        'grapesjs-preset-newsletter': {},
        'grapesjs-plugin-export': {
          addExportBtn: true,
        },
      },
      storageManager: {
        type: 'local', // Change to 'remote' for server storage
        autosave: true,
        autoload: true,
      },
      // Style Manager for adding classes and styling
      styleManager: {
        sectors: [
          {
            name: 'Dimension',
            open: false,
            buildProps: ['width', 'height', 'min-width', 'max-width', 'min-height', 'max-height', 'margin', 'padding'],
          },
          {
            name: 'Typography',
            open: false,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align'],
          },
          {
            name: 'Decorations',
            open: false,
            buildProps: ['border-radius', 'background-color', 'border', 'box-shadow'],
          },
        ],
      },
      blockManager: {
        appendTo: '#blocks',
        blocks: [
          {
            id: '1-section',
            label: '1 Section',
            content: '<div style="padding:20px; width:100%; background-color:#f9f9f9;">1 Section</div>',
          },
          {
            id: 'half-section',
            label: '1/2 Section',
            content: `
              <div style="display:flex; justify-content:space-between;">
                <div style="flex: 0 0 48%; background-color:#f9f9f9; padding:10px;">1/2 Section</div>
                <div style="flex: 0 0 48%; background-color:#f9f9f9; padding:10px;">1/2 Section</div>
              </div>
            `,
          },
          {
            id: 'third-section',
            label: '1/3 Section',
            content: `
              <div style="display:flex; justify-content:space-between;">
                <div style="flex: 0 0 30%; background-color:#f9f9f9; padding:10px;">1/3 Section</div>
                <div style="flex: 0 0 30%; background-color:#f9f9f9; padding:10px;">1/3 Section</div>
                <div style="flex: 0 0 30%; background-color:#f9f9f9; padding:10px;">1/3 Section</div>
              </div>
            `,
          },
          {
            id: 'button',
            label: 'Button',
            content: '<button style="padding:10px; background-color:#007bff; color:white; border:none;">Button</button>',
          },
          {
            id: 'divider',
            label: 'Divider',
            content: '<hr style="border:1px solid #ccc;"/>',
          },
          {
            id: 'text',
            label: 'Text',
            content: '<p>This is a text block.</p>',
          },
          {
            id: 'text-section',
            label: 'Text Section',
            content: '<div style="padding:10px;"><p>Text Section</p></div>',
          },
          {
            id: 'image',
            label: 'Image',
            content: '<img src="https://via.placeholder.com/150" alt="placeholder"/>',
          },
          {
            id: 'quote',
            label: 'Quote',
            content: '<blockquote style="padding:10px; font-style:italic;">This is a quote.</blockquote>',
          },
          {
            id: 'link',
            label: 'Link',
            content: '<a href="#">This is a link</a>',
          },
          {
            id: 'link-block',
            label: 'Link Block',
            content: '<div><a href="#" style="padding:10px;">Link Block</a></div>',
          },
        ],
      },

      // Allow users to add classes
      selectorManager: {
        appendTo: '.selectors-container'
      },

      // Canvas and default components
      canvas: {
        styles: [
          // Load custom CSS to apply hover effects
          `.hover-effect:hover {
         background-color: #f0f0f0;
         transform: scale(1.05);
         transition: transform 0.3s ease;
       }`
        ]
      },
    });

    // Add hover effect dynamically when user assigns a hover class
    editor.on('component:toggled', (model) => {
      const classes = model.getClasses();
      if (classes.includes('hover-effect')) {
        model.addStyle({
          'transition': 'transform 0.3s ease',
          'background-color': '#f0f0f0',
        });
      }
    });

    // Undo/Redo Commands
    editor.Commands.add('undo', {
      run(editor) {
        editor.runCommand('core:undo');
      },
    });

    editor.Commands.add('redo', {
      run(editor) {
        editor.runCommand('core:redo');
      },
    });

    // Bind keyboard shortcuts for undo and redo
    document.addEventListener('keydown', function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        editor.runCommand('core:undo');
      } else if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
        event.preventDefault();
        editor.runCommand('core:redo');
      }
    });

    // Optional: Add toolbar buttons for undo/redo
    const panelManager = editor.Panels;
    panelManager.addButton('options', [
      {
        id: 'undo',
        className: 'fa fa-undo',
        command: 'core:undo',
        attributes: { title: 'Undo (Ctrl+Z)' },
      },
      {
        id: 'redo',
        className: 'fa fa-redo',
        command: 'core:redo',
        attributes: { title: 'Redo (Ctrl+Y)' },
      },
    ]);

    // Cleanup
    return () => editor.destroy();
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div id="blocks" style={{ width: '300px', borderRight: '1px solid #ddd', height:"100vh" }}></div>
      <div ref={editorRef} style={{ flex: 1 }}></div>
    </div>
  );
};

export default EmailTemplateDesigner;
