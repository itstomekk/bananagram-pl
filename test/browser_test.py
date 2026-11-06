import os, pathlib, socket, subprocess, sys, time
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parents[1]
s=socket.socket();s.bind(('127.0.0.1',0));port=s.getsockname()[1];s.close()
env={**os.environ,'PORT':str(port)}
srv=subprocess.Popen(['node',str(root/'docs/server.js')],env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
 for _ in range(100):
  try: socket.create_connection(('127.0.0.1',port),.2).close();break
  except OSError: time.sleep(.05)
 else: raise AssertionError('server not listening')
 with sync_playwright() as p:
  browser=p.chromium.launch(channel='chrome',headless=True)
  a=browser.new_context(viewport={'width':1280,'height':900});b=browser.new_context(viewport={'width':390,'height':844})
  host=a.new_page();guest=b.new_page(); errors=[]
  for page in [host,guest]:
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.on('response',lambda r: errors.append(f'HTTP {r.status} {r.url}') if r.status>=400 and f'127.0.0.1:{port}' in r.url else None)
  url=f'http://127.0.0.1:{port}/'
  host.goto(url);guest.goto(url)
  # Simulate a static host: an HTML error page instead of the room API.
  static=browser.new_page(viewport={'width':1280,'height':900})
  static.route('**/api/**',lambda route: route.fulfill(status=404,content_type='text/html',body='<html>Not found</html>'))
  static.goto(url);static.locator('#create').click()
  static.wait_for_function("document.querySelector('#status').textContent.length > 0")
  message=static.locator('#status').inner_text()
  assert 'serwer' in message.lower() and 'json' not in message.lower(),message
  static.locator('#solo').click()
  assert static.locator('#hand .tile').count()==21
  assert static.locator('#game').bounding_box()['height'] == 900
  assert static.locator('#board').bounding_box()['width'] > 500
  assert static.locator('.side').bounding_box()['x'] > static.locator('#board').bounding_box()['x']
  assert static.locator('a[href="https://github.com/itstomekk/bananagram-pl"]').count()==1
  assert static.locator('a[href="https://github.com/itstomekk/bananagram-pl/tree/main/3d"]').count()==1
  static.close()
  host.locator('#name').fill('Ala');host.locator('#create').click();host.locator('#code').wait_for(state='visible');code=host.locator('#code').inner_text();assert len(code)==6
  guest.locator('#name').fill('Ola');guest.locator('#room').fill(code);guest.locator('#join').click();guest.locator('#waiting').wait_for(state='visible')
  host.locator('#start').wait_for(state='visible');host.wait_for_function("!document.querySelector('#start').disabled");host.locator('#start').click()
  host.locator('#board .cell').first.wait_for();guest.locator('#board .cell').first.wait_for()
  assert host.locator('#hand .tile').count()==21 and guest.locator('#hand .tile').count()==21
  host.locator('#hand .tile').first.click();host.locator('.cell[data-x="7"][data-y="7"]').click()
  guest.wait_for_function("window.__literki.game.players[0].hand.length===20")
  assert guest.evaluate("Object.keys(window.__literki.game.players[0].board).length")==1
  guest.locator('#hand .tile').first.click();guest.locator('.cell[data-x="7"][data-y="7"]').click()
  host.wait_for_function("window.__literki.game.players[1].hand.length===20")
  assert host.evaluate("Object.keys(window.__literki.game.players[1].board).length")==1
  guest.reload();guest.locator('#board .occupied').wait_for();assert guest.locator('#hand .tile').count()==20
  assert guest.evaluate('document.documentElement.scrollWidth <= innerWidth')
  scratch=pathlib.Path(os.environ['LOCALAPPDATA'])/'hermes'/'cache'/'scratch';scratch.mkdir(parents=True,exist_ok=True);host.screenshot(path=str(scratch/'literki-desktop.png'),full_page=True);guest.screenshot(path=str(scratch/'literki-mobile.png'),full_page=True)
  host.locator('.leave').last.click();host.locator('#solo').click();assert host.locator('#hand .tile').count()==21
  host.locator('#hand .tile').first.click();host.locator('.cell[data-x="7"][data-y="7"]').click();assert host.locator('#hand .tile').count()==20
  assert host.locator('#hand .tile[aria-pressed="true"]').count()==0
  host.reload();host.locator('#resume').click();assert host.locator('#hand .tile').count()==20
  host.screenshot(path=str(scratch/'literki-solo.png'),full_page=True)
  host.locator('.cell[data-x="7"][data-y="7"]').click();assert host.locator('#hand .tile').count()==21
  assert not errors,errors
  browser.close()
 print('PASS browser: solo, two isolated clients, bidirectional moves, reload, mobile width, HTTP/page errors')
finally:
 srv.terminate();srv.wait(timeout=5)
