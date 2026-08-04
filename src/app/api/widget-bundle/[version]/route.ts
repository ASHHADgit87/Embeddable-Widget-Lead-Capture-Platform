interface RouteContext {
  params: Promise<{ version: string }>;
}

const WIDGET_BUNDLE_SCRIPT = `
(function () {
  var script = document.currentScript;
  var widgetId = script && new URL(script.src, window.location.href).searchParams.get('id');
  if (!widgetId) {
    console.error('[widget] missing ?id= on script tag');
    return;
  }

  var apiBase = new URL(script.src, window.location.href).origin;

  function buildField(field) {
    var wrapper = document.createElement('div');
    wrapper.style.marginBottom = '10px';

    var label = document.createElement('label');
    label.textContent = field.label;
    label.style.display = 'block';
    label.style.fontSize = '13px';
    label.style.marginBottom = '4px';

    var input;
    if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 3;
    } else if (field.type === 'checkbox') {
      input = document.createElement('input');
      input.type = 'checkbox';
    } else {
      input = document.createElement('input');
      input.type = field.type;
    }
    input.name = field.name;
    if (field.required) input.required = true;
    if (field.placeholder) input.setAttribute('placeholder', field.placeholder);
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    input.style.padding = '8px';
    input.style.fontSize = '14px';

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    return wrapper;
  }

  fetch(apiBase + '/api/widgets/' + widgetId + '/config')
    .then(function (res) { return res.json(); })
    .then(function (json) {
      if (!json.success) {
        console.error('[widget] failed to load config', json.error);
        return;
      }
      var config = json.data;

      var container = document.createElement('div');
      container.style.fontFamily = 'system-ui, sans-serif';
      container.style.maxWidth = '360px';
      container.style.padding = '16px';
      container.style.border = '1px solid #ddd';
      container.style.borderRadius = '8px';

      var title = document.createElement('h3');
      title.textContent = config.title;
      title.style.margin = '0 0 8px 0';
      container.appendChild(title);

      if (config.description) {
        var desc = document.createElement('p');
        desc.textContent = config.description;
        desc.style.margin = '0 0 12px 0';
        desc.style.fontSize = '13px';
        desc.style.color = '#555';
        container.appendChild(desc);
      }

      var form = document.createElement('form');
      config.fields.forEach(function (field) {
        form.appendChild(buildField(field));
      });

      var honeypot = document.createElement('input');
      honeypot.type = 'text';
      honeypot.name = config.honeypotFieldName;
      honeypot.tabIndex = -1;
      honeypot.autocomplete = 'off';
      honeypot.style.position = 'absolute';
      honeypot.style.left = '-9999px';
      honeypot.setAttribute('aria-hidden', 'true');
      form.appendChild(honeypot);

      var submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.textContent = config.buttonText;
      submitBtn.style.marginTop = '8px';
      submitBtn.style.padding = '8px 16px';
      submitBtn.style.cursor = 'pointer';
      form.appendChild(submitBtn);

      var statusMsg = document.createElement('p');
      statusMsg.style.fontSize = '13px';
      statusMsg.style.marginTop = '8px';

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var formData = new FormData(form);
        var payloadData = {};
        formData.forEach(function (value, key) {
          payloadData[key] = value;
        });

        fetch(apiBase + '/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ widgetId: widgetId, data: payloadData }),
        })
          .then(function (res) { return res.json(); })
          .then(function (json) {
            statusMsg.textContent = json.success ? 'Thank you!' : 'Something went wrong.';
            if (json.success) form.reset();
          })
          .catch(function () {
            statusMsg.textContent = 'Network error, please try again.';
          });
      });

      container.appendChild(form);
      container.appendChild(statusMsg);

      script.parentNode.insertBefore(container, script.nextSibling);
    })
    .catch(function (err) {
      console.error('[widget] failed to initialize', err);
    });
})();
`;

export async function GET(
  _request: Request,
  { params }: RouteContext,
): Promise<Response> {
  await params;

  return new Response(WIDGET_BUNDLE_SCRIPT, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
