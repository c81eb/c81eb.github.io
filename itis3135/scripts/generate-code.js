// M13: generate HTML, JSON and XML from the current form values.
// The JSON uses the same key names as the form fields, which is the shape
// the class server (intro-form.tommyhost.ing) stores for other students.
(function () {
    'use strict';

    // Used when no picture is chosen. Matches the image on introduction.html.
    const DEFAULT_IMAGE = 'images/me.jpg';
    const LINK_LABELS = ['CLT Web', 'GitHub.io', 'GitHub', 'freeCodeCamp', 'Codecademy', 'LinkedIn'];

    const form = document.getElementById('form');
    const output = document.getElementById('code-output');

    // Escape text so it is safe inside HTML or XML.
    function esc(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    function val(name, scope) {
        const el = (scope || form).querySelector('[name="' + name + '"]');
        return el ? el.value.trim() : '';
    }

    // ---------- Image helpers ----------
    // Short path, used in the HTML and XML output.
    function imagePath() {
        const file = form.querySelector('[name="img"]').files[0];
        return file ? 'images/' + file.name : DEFAULT_IMAGE;
    }

    function readAsDataUri(blob) {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.onload = function () { resolve(reader.result); };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // Data URI, used in the JSON so the image travels with the data.
    // Falls back to the plain path if the image can't be read.
    async function imageDataUri() {
        try {
            const file = form.querySelector('[name="img"]').files[0];
            if (file) {
                return await readAsDataUri(file);
            }
            const response = await fetch(DEFAULT_IMAGE);
            if (!response.ok) {
                throw new Error('image not found');
            }
            return await readAsDataUri(await response.blob());
        } catch (error) {
            return imagePath();
        }
    }

    // Read the form fresh on every click so changes are always reflected.
    function collectData(img) {
        const courses = Array.from(form.querySelectorAll('.course')).map(function (row) {
            return {
                department: val('department', row),
                courseNumber: val('courseNumber', row),
                courseTitle: val('courseTitle', row),
                reasonForTaking: val('reasonForTaking', row)
            };
        });

        const data = {
            firstName: val('firstName'),
            middleName: val('middleName'),
            nickname: val('nickname'),
            lastName: val('lastName'),
            acknowledgment: val('acknowledgment'),
            acknowledgmentDate: val('acknowledgmentDate'),
            adjectives: val('adjectives'),
            animal: val('animal'),
            prettyNameDivider: val('prettyNameDivider'),
            img: img,
            caption: val('caption'),
            personalInfo: {
                statement: val('statement'),
                personalBackground: val('personalBackground'),
                professionalBackground: val('professionalBackground'),
                academicBackground: val('academicBackground'),
                primaryWorkComputer: val('primaryWorkComputer'),
                primaryWorkLocation: val('primaryWorkLocation'),
                alternateComputerLocation: val('alternateComputerLocation')
            },
            subjectBackground: val('subjectBackground'),
            courses: courses,
            quote: val('quote'),
            quoteAuthor: val('quoteAuthor'),
            funnyItem: val('funnyItem'),
            somethingToShare: val('somethingToShare')
        };

        data.footerLinks = LINK_LABELS.map(function (label, i) {
            return { label: label, url: val('link' + (i + 1)) };
        });
        return data;
    }

    function fullName(d) {
        return [d.firstName, d.middleName, d.nickname ? "'" + d.nickname + "'" : '', d.lastName]
            .filter(Boolean).join(' ');
    }

    // ---------- HTML ----------
    function buildHTML(d) {
        const p = d.personalInfo;
        const lines = [];
        lines.push('<h2>Introduction</h2>');
        lines.push('<h6>' + esc(fullName(d)) + ' ' + esc(d.prettyNameDivider) + ' ' +
            esc(d.adjectives) + ' ' + esc(d.animal) + '</h6>');
        lines.push('');
        lines.push('<figure>');
        lines.push('    <img src="' + esc(d.img) + '" alt="' + esc(d.caption) + '">');
        lines.push('    <figcaption>' + esc(d.caption) + '</figcaption>');
        lines.push('</figure>');
        lines.push('');
        lines.push('<ul>');
        lines.push('    <li><strong>Personal Background:</strong> ' + esc(p.personalBackground) + '</li>');
        lines.push('    <li><strong>Professional Background:</strong> ' + esc(p.professionalBackground) + '</li>');
        lines.push('    <li><strong>Academic Background:</strong> ' + esc(p.academicBackground) + '</li>');
        lines.push('    <li><strong>Background in this Subject:</strong> ' + esc(d.subjectBackground) + '</li>');
        lines.push('    <li><strong>Primary Work Computer:</strong> ' + esc(p.primaryWorkComputer) + '</li>');
        lines.push('    <li><strong>Primary Work Location:</strong> ' + esc(p.primaryWorkLocation) + '</li>');
        lines.push('    <li><strong>Alternate Computer:</strong> ' + esc(p.alternateComputerLocation) + '</li>');
        lines.push('    <li><strong>Courses I\'m Taking &amp; Why:</strong>');
        lines.push('        <ol>');
        d.courses.forEach(function (c) {
            lines.push('            <li>' + esc(c.department) + ' ' + esc(c.courseNumber) + ' - ' + esc(c.courseTitle));
            lines.push('                <ol>');
            lines.push('                    <li>' + esc(c.reasonForTaking) + '</li>');
            lines.push('                </ol>');
            lines.push('            </li>');
        });
        lines.push('        </ol>');
        lines.push('    </li>');
        if (d.funnyItem) {
            lines.push('    <li><strong>Funny/Interesting Item:</strong> ' + esc(d.funnyItem) + '</li>');
        }
        if (d.somethingToShare) {
            lines.push('    <li><strong>Something I Would Like to Share:</strong> ' + esc(d.somethingToShare) + '</li>');
        }
        lines.push('</ul>');
        lines.push('');
        lines.push('<blockquote>');
        lines.push('    <p>"' + esc(d.quote) + '"</p>');
        lines.push('    <cite>- ' + esc(d.quoteAuthor) + '</cite>');
        lines.push('</blockquote>');
        lines.push('');
        lines.push('<ul>');
        d.footerLinks.forEach(function (l) {
            lines.push('    <li><a href="' + esc(l.url) + '">' + esc(l.label) + '</a></li>');
        });
        lines.push('</ul>');
        return lines.join('\n');
    }

    // ---------- JSON ----------
    function buildJSON(d) {
        return JSON.stringify(d, null, 2);
    }

    // ---------- XML ----------
    function tag(name, value, indent) {
        return indent + '<' + name + '>' + esc(value) + '</' + name + '>';
    }

    function buildXML(d) {
        const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<introduction>'];

        ['firstName', 'middleName', 'nickname', 'lastName', 'acknowledgment',
            'acknowledgmentDate', 'adjectives', 'animal', 'prettyNameDivider', 'img',
            'caption'].forEach(function (k) {
            lines.push(tag(k, d[k], '    '));
        });

        lines.push('    <personalInfo>');
        ['statement', 'personalBackground', 'professionalBackground', 'academicBackground',
            'primaryWorkComputer', 'primaryWorkLocation', 'alternateComputerLocation'].forEach(function (k) {
            lines.push(tag(k, d.personalInfo[k], '        '));
        });
        lines.push('    </personalInfo>');
        lines.push(tag('subjectBackground', d.subjectBackground, '    '));

        lines.push('    <courses>');
        d.courses.forEach(function (c) {
            lines.push('        <course>');
            lines.push(tag('department', c.department, '            '));
            lines.push(tag('courseNumber', c.courseNumber, '            '));
            lines.push(tag('courseTitle', c.courseTitle, '            '));
            lines.push(tag('reasonForTaking', c.reasonForTaking, '            '));
            lines.push('        </course>');
        });
        lines.push('    </courses>');

        ['quote', 'quoteAuthor', 'funnyItem', 'somethingToShare'].forEach(function (k) {
            lines.push(tag(k, d[k], '    '));
        });

        lines.push('    <footerLinks>');
        d.footerLinks.forEach(function (l) {
            lines.push('        <link>');
            lines.push(tag('label', l.label, '            '));
            lines.push(tag('url', l.url, '            '));
            lines.push('        </link>');
        });
        lines.push('    </footerLinks>');

        lines.push('</introduction>');
        return lines.join('\n');
    }

    // ---------- Output ----------
    // One section per format; clicking again replaces that section with fresh data.
    function show(type, label, code) {
        const id = 'output-' + type;
        let section = document.getElementById(id);
        if (!section) {
            section = document.createElement('section');
            section.id = id;
            output.appendChild(section);
        }
        section.innerHTML = '';

        const heading = document.createElement('h3');
        heading.textContent = label;

        const area = document.createElement('textarea');
        area.id = id + '-text';
        area.rows = 20;
        area.readOnly = true;
        area.style.width = '100%';
        area.value = code;

        const lbl = document.createElement('label');
        lbl.htmlFor = area.id;
        lbl.textContent = label + ' code';

        section.appendChild(heading);
        section.appendChild(lbl);
        section.appendChild(area);
    }

    document.getElementById('generate-html').addEventListener('click', function () {
        show('html', 'Generated HTML', buildHTML(collectData(imagePath())));
    });

    document.getElementById('generate-json').addEventListener('click', async function () {
        const img = await imageDataUri();
        show('json', 'Generated JSON', buildJSON(collectData(img)));
    });

    document.getElementById('generate-xml').addEventListener('click', function () {
        show('xml', 'Generated XML', buildXML(collectData(imagePath())));
    });
})();