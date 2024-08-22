function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    width: params.get('width'),
    height: params.get('height'),
    left: params.get('left'),
    top: params.get('top'),
    primary: params.get('primary') === 'true'
  };
}

function displayMonitorInfo(resolution, position, isPrimary) {
  document.getElementById('resolution').textContent = `Resolution: ${resolution.width}x${resolution.height}`;
  document.getElementById('position').textContent = `Position: (${position.left}, ${position.top})`;
  document.getElementById('primary').textContent = isPrimary ? 'Primary Monitor' : 'Secondary Monitor';
}

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    width: params.get('width'),
    height: params.get('height'),
    left: params.get('left'),
    top: params.get('top'),
    primary: params.get('primary') === 'true'
  };
}

document.addEventListener('DOMContentLoaded', () => {

  const params = getQueryParams();
  console.log('params: ', params);
  displayMonitorInfo(
    { width: params.width, height: params.height },
    { left: params.left, top: params.top },
    params.primary
  );
});
