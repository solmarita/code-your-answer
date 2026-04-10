from aqt import gui_hooks
from .core import init_cya

gui_hooks.profile_did_open.append(init_cya)