#!/usr/bin/env python3
# Created by xiaosanyu at 16/6/16
# section 126
TITLE = "Signal"
DESCRIPTION = """
connect the button's signal
"""
import gi

gi.require_version('Gtk', '3.0')
from gi.repository import Gtk
import os


class Handler:
    @staticmethod
    def onDeleteWindow(*args):
        Gtk.main_quit(*args)

    @staticmethod
    def onButtonPressed(button):
        print("Hello World!")


def main():
    builder = Gtk.Builder()
    builder.add_from_file(os.path.join(os.path.dirname(__file__), "example1.ui"))
    builder.connect_signals(Handler())

    window = builder.get_object("window1")
    window.show_all()

    Gtk.main()


if __name__ == "__main__":
    main()