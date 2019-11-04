# -*- mode: python -*-

block_cipher = None


a = Analysis(['./torchbrain/torchbrain.py'],
             binaries=[],
             datas=[
                 ('./torchbrain/vgg16-397923af.pth', '.'),
                 ('./env/lib/python3.7/site-packages/torchvision/models/detection/_utils.py', './torchvision/models/detection/'),
                 ('./env/lib/python3.7/site-packages/torchvision/ops/misc.py', './torchvision/ops/')
                 ],
             hiddenimports=[],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          [],
          exclude_binaries=True,
          name='torchbrain',
          debug=False,
          bootloader_ignore_signals=True,
          strip=False,
          upx=True,
          console=True )
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas,
               strip=False,
               upx=True,
               name='torchbrain')
