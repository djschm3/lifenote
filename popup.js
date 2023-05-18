window.onload = function() {
    var firebaseConfig = {
        apiKey: "AIzaSyDfrvgMDqUvhhJOAvjmSlZUV-p4DhFXFrA",
        authDomain: "lifenote-a6d56.firebaseapp.com",
        databaseURL: "https://lifenote-a6d56-default-rtdb.firebaseio.com",
        projectId: "lifenote-a6d56",
        storageBucket: "lifenote-a6d56.appspot.com",
        messagingSenderId: "534214175505",
        appId: "1:534214175505:web:9ef75a8c16d35ec989bab0",
        measurementId: "G-RJ7VHYTSD0"
    };
    var firebaseDatabaseURL = firebaseConfig.databaseURL;
  
    var editingNoteKey = null;
  
    document.getElementById('save').addEventListener('click', function() {
      var note = document.getElementById('note').value;
      var category = document.getElementById('category').value;
      var reminder = document.getElementById('reminder').value;
      if (editingNoteKey) {
        fetch(firebaseDatabaseURL + '/notes/' + editingNoteKey + '.json', {
          method: 'PATCH',
          body: JSON.stringify({note: note, category: category, reminder: reminder})
        }).then(function(response) {
          if (!response.ok) {
            console.log('Failed to update note.');
          } else {
            console.log('Note updated.');
            editingNoteKey = null;
            document.getElementById('note').value = '';
          }
        });
      } else {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          var url = tabs[0].url;
          var noteObject = {note: note, category: category, reminder: reminder, url: url};
          fetch(firebaseDatabaseURL + '/notes.json', {
            method: 'POST',
            body: JSON.stringify(noteObject)
          }).then(function(response) {
            if (!response.ok) {
              console.log('Failed to save note to Firebase.');
            } else {
              console.log('Note saved to Firebase.');
            }
          });
        });
      }
    });
  
    document.getElementById('delete').addEventListener('click', function() {
      fetch(firebaseDatabaseURL + '/notes.json', {
        method: 'DELETE'
      }).then(function(response) {
        if (!response.ok) {
          console.log('Failed to delete notes.');
        } else {
          console.log('Notes deleted.');
        }
      });
    });
  
    document.getElementById('view-reminders').addEventListener('click', function() {
      var date = document.getElementById('view-reminders-date').value;
      fetch(firebaseDatabaseURL + '/notes.json')
        .then(response => response.json())
        .then(notes => {
          var reminders = document.getElementById('reminders');
          reminders.innerHTML = '';  // Clear the current reminders
          for (var key in notes) {
            var note = notes[key];
            if (note.reminder === date) {
              var li = document.createElement('li');
              li.textContent = note.note;
              reminders.appendChild(li);
            }
          }
        });
    });
  
    document.getElementById('view-all').addEventListener('click', function() {
        fetch(firebaseDatabaseURL + '/notes.json')
          .then(response => response.json())
          .then(notes => {
            var allNotes = document.getElementById('all-notes');
            allNotes.innerHTML = '';  // Clear the current notes
            for (var key in notes) {
              var note = notes[key];
              var li = document.createElement('li');
              li.textContent = note.note;
    
              var editButton = document.createElement('button');
              editButton.textContent = 'Edit';
              editButton.addEventListener('click', function() {
                document.getElementById('note').value = note.note;
                editingNoteKey = key;
              });
              li.appendChild(editButton);
    
              allNotes.appendChild(li);
            }
          });
      });
    
      document.getElementById('cancel').addEventListener('click', function() {
        editingNoteKey = null;
        document.getElementById('note').value = '';
      });
    };