from aqt import gui_hooks
from .core import setup

gui_hooks.profile_did_open.append(init_cya)