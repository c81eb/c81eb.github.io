// Introduction form behavior: Submit builds the intro page, plus Add Course, Reset and Clear.
(function () {
    'use strict';

    // Used when no picture is chosen. Matches the image on introduction.html.
    const DEFAULT_IMAGE = 'images/me.jpg';

    const form = document.getElementById('form');
    const coursesBox = document.getElementById('courses');
    const addButton = document.getElementById('add-course');
    const clearButton = document.getElementById('clear');
    const main = document.querySelector('main');
    const codeOutput = document.getElementById('code-output');

    let objectUrl = null;

    // Escape text so it is safe inside HTML.
    function esc(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function val(name, scope) {
        const el = (scope || form).querySelector('[name="' + name + '"]');
        return el ? el.value.trim() : '';
    }

    // ---------- Add / Delete course ----------
    addButton.addEventListener('click', function () {
        const rows = coursesBox.querySelectorAll('.course');
        const copy = rows[rows.length - 1].cloneNode(true);

        copy.querySelectorAll('input').forEach(function (input) {
            input.value = '';
        });

        if (!copy.querySelector('.delete-course')) {
            const del = document.createElement('button');
            del.type = 'button';
            del.className = 'delete-course';
            del.textContent = 'Delete Course';
            copy.appendChild(del);
        }
        copy.dataset.added = 'true';
        coursesBox.insertBefore(copy, addButton);
    });

    coursesBox.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-course')) {
            const row = event.target.closest('.course');
            if (coursesBox.querySelectorAll('.course').length > 1) {
                row.remove();
            }
        }
    });

    // ---------- Reset: also remove rows added with Add Course ----------
    form.addEventListener('reset', function () {
        coursesBox.querySelectorAll('.course[data-added="true"]').forEach(function (row) {
            row.remove();
        });
    });

    // ---------- Clear: empty every field ----------
    clearButton.addEventListener('click', function () {
        form.querySelectorAll('input, textarea').forEach(function (field) {
            if (field.type === 'file') {
                field.value = '';
            } else {
                field.value = '';
            }
        });
    });

    // ---------- Submit: build the intro page ----------
    function imageSource() {
        const file = form.querySelector('[name="img"]').files[0];
        if (!file) {
            return DEFAULT_IMAGE;
        }
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
        objectUrl = URL.createObjectURL(file);
        return objectUrl;
    }

    function buildIntro() {
        const nickname = val('nickname');
        const name = [val('firstName'), val('middleName'), nickname ? "'" + nickname + "'" : '', val('lastName')]
            .filter(Boolean).join(' ');
        const caption = val('caption');

        let html = '';
        html += '<h2>Introduction</h2>';
        html += '<h6>' + esc(name) + ' ' + esc(val('prettyNameDivider')) + ' ' +
            esc(val('adjectives')) + ' ' + esc(val('animal')) + '</h6>';
        html += '<figure><img src="' + esc(imageSource()) + '" alt="' + esc(caption) + '">' +
            '<figcaption>' + esc(caption) + '</figcaption></figure>';
        html += '<p>' + esc(val('statement')) + '</p>';
        html += '<ul>';
        html += '<li><strong>Personal Background:</strong> ' + esc(val('personalBackground')) + '</li>';
        html += '<li><strong>Professional Background:</strong> ' + esc(val('professionalBackground')) + '</li>';
        html += '<li><strong>Academic Background:</strong> ' + esc(val('academicBackground')) + '</li>';
        html += '<li><strong>Background in this Subject:</strong> ' + esc(val('subjectBackground')) + '</li>';
        html += '<li><strong>Primary Work Computer:</strong> ' + esc(val('primaryWorkComputer')) + '</li>';
        html += '<li><strong>Primary Work Location:</strong> ' + esc(val('primaryWorkLocation')) + '</li>';
        html += '<li><strong>Alternate Computer:</strong> ' + esc(val('alternateComputerLocation')) + '</li>';
        html += '<li><strong>Courses I\'m Taking &amp; Why:</strong><ol>';
        coursesBox.querySelectorAll('.course').forEach(function (row) {
            html += '<li>' + esc(val('department', row)) + ' ' + esc(val('courseNumber', row)) +
                ' - ' + esc(val('courseTitle', row)) +
                '<ol><li>' + esc(val('reasonForTaking', row)) + '</li></ol></li>';
        });
        html += '</ol></li>';
        if (val('funnyItem')) {
            html += '<li><strong>Funny/Interesting Item:</strong> ' + esc(val('funnyItem')) + '</li>';
        }
        if (val('somethingToShare')) {
            html += '<li><strong>Something I Would Like to Share:</strong> ' + esc(val('somethingToShare')) + '</li>';
        }
        html += '</ul>';
        html += '<blockquote><p>"' + esc(val('quote')) + '"</p><cite>- ' + esc(val('quoteAuthor')) + '</cite></blockquote>';

        const linkLabels = ['CLT Web', 'GitHub.io', 'GitHub', 'freeCodeCamp', 'Codecademy', 'LinkedIn'];
        html += '<ul>';
        linkLabels.forEach(function (label, i) {
            html += '<li><a href="' + esc(val('link' + (i + 1))) + '">' + esc(label) + '</a></li>';
        });
        html += '</ul>';
        return html;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        let result = document.getElementById('intro-result');
        if (!result) {
            result = document.createElement('div');
            result.id = 'intro-result';
            main.appendChild(result);
        }
        result.innerHTML = buildIntro() +
            '<button type="button" id="back-to-form">Edit Form</button>';

        form.hidden = true;
        if (codeOutput) {
            codeOutput.hidden = true;
        }
        result.hidden = false;

        document.getElementById('back-to-form').addEventListener('click', function () {
            result.hidden = true;
            form.hidden = false;
            if (codeOutput) {
                codeOutput.hidden = false;
            }
        });
    });
})();