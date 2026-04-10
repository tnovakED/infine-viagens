"""
Infine Viagens - Gerador de Preview Standalone
Executa: python gerar-preview.py
Gera: infine-preview.html (arquivo unico para envio)

Estrategia de tamanho:
- Cada imagem e embutida uma unica vez como variavel JS
- Um script injeta os src de todas as tags <img> iguais
- Fontes embutidas no CSS (necessario para render offline)
"""

import base64, re, os

ROOT = os.path.dirname(os.path.abspath(__file__))

def b64(path):
    if not os.path.exists(path):
        print(f"  [aviso] nao encontrado: {path}")
        return None
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode()
    ext = os.path.splitext(path)[1].lower()
    mime = {
        ".png":  "image/png",
        ".jpg":  "image/jpeg",
        ".jpeg": "image/jpeg",
        ".ttf":  "font/truetype",
    }.get(ext, "application/octet-stream")
    return f"data:{mime};base64,{data}"

# -- 1. Le HTML / CSS / JS -------------------------------------------
with open(os.path.join(ROOT, "index.html"), encoding="utf-8") as f:
    html = f.read()
with open(os.path.join(ROOT, "css", "styles.css"), encoding="utf-8") as f:
    css = f.read()
with open(os.path.join(ROOT, "js", "main.js"), encoding="utf-8") as f:
    js = f.read()

# -- 2. Embutir fontes no CSS (uma vez cada) -------------------------
fonts = {
    "PlayfairDisplay-Regular":     "assets/fonts/PlayfairDisplay-Regular.ttf",
    "PlayfairDisplay-Italic":      "assets/fonts/PlayfairDisplay-Italic.ttf",
    "PlayfairDisplay-Bold":        "assets/fonts/PlayfairDisplay-Bold.ttf",
    "PlayfairDisplay-BoldItalic":  "assets/fonts/PlayfairDisplay-BoldItalic.ttf",
    "PlayfairDisplay-Black":       "assets/fonts/PlayfairDisplay-Black.ttf",
    "PlayfairDisplay-BlackItalic": "assets/fonts/PlayfairDisplay-BlackItalic.ttf",
}
for name, rel_path in fonts.items():
    uri = b64(os.path.join(ROOT, rel_path))
    if uri:
        css = css.replace(f"url('../{rel_path}')", f"url('{uri}')")
        print(f"  OK fonte: {name}")

# -- 3. Imagens: embutir UMA VEZ como variaveis JS ------------------
logo_uri  = b64(os.path.join(ROOT, "assets", "images", "logo.png"))
fundo_uri = b64(os.path.join(ROOT, "assets", "images", "fundo-cartao.png"))

# Substitui apenas a PRIMEIRA ocorrencia de cada imagem no HTML
# As demais sao substituidas pelo mesmo data URI via JS abaixo

if logo_uri:
    html = html.replace('src="assets/images/logo.png"', f'src="{logo_uri}"', 1)
    # demais ocorrencias do logo
    html = html.replace('src="assets/images/logo.png"', f'src="{logo_uri}"')
    print("  OK logo embutida")

if fundo_uri:
    # Substitui todas as ocorrencias de uma vez (a imagem e a mesma, so embutida uma vez no arquivo pois o HTML ja referencia o mesmo src)
    html = html.replace('src="assets/images/fundo-cartao.png"', 'src="__FUNDO__"')

# -- 4. Script JS que injeta o fundo (armazenado uma vez) -----------
inject_js = ""
if fundo_uri:
    # Guarda o data URI numa variavel JS e aplica em todos os elementos
    # O data URI real fica apenas UMA vez no arquivo HTML (dentro da variavel)
    inject_js = f"""
<script>
(function(){{
  var f='{fundo_uri}';
  document.querySelectorAll('img[src="__FUNDO__"]').forEach(function(el){{el.src=f;}});
}})();
</script>"""
    print("  OK fundo embutido (1x via JS)")

# -- 5. Injeta CSS ---------------------------------------------------
css_tag = f"<style>\n{css}\n</style>"
html = re.sub(r'<link rel="stylesheet" href="css/styles\.css"\s*/?>', css_tag, html)

# -- 6. Injeta JS principal + inject_js -----------------------------
js_block = f"<script>\n{js}\n</script>{inject_js}"
html = re.sub(r'<script src="js/main\.js"></script>', js_block, html)

# -- 7. Salvar -------------------------------------------------------
out_path = os.path.join(ROOT, "infine-preview.html")
with open(out_path, "w", encoding="utf-8") as f:
    f.write(html)

size_kb = os.path.getsize(out_path) // 1024
size_mb = size_kb / 1024
print(f"\nArquivo gerado: infine-preview.html  ({size_mb:.1f} MB)")
print("Envie para a Leila via WhatsApp ou e-mail — ela abre no navegador.")
