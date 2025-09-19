#!/usr/bin/env python
#-*- coding:utf-8 -*-
# By Chris Oliver
# Adapted from http://www.pygtk.org/pygtk2tutorial/examples/helloworld.py

import sys

import gi

gi.require_version("Gtk", "3.0")
from gi.repository import GLib, Gio, Gtk, GObject

import gobject
import gtk
gtk.gdk.threads_init()

import threading

class HelloWorld:
    def __init__(self):
        """
            Initializes the GTK application, in our case, create the window
            and other widgets
        """

        # Create a window
        self.window = gtk.Window(gtk.WINDOW_TOPLEVEL)
        self.window.set_border_width(10)

        # Setup the application to exit GTK when the window is closed
        self.window.connect("destroy", self.destroy)

        # Create a button
        self.button = gtk.Button("Hello World")

        # Make the button call self.hello() when it is clicked
        self.button.connect("clicked", self.hello_helper)

        # Add the button into the window
        self.window.add(self.button)

        # Display the button and the window
        self.button.show()
        self.window.show()

    def hello(self, widget, data=None):
        import time
        time.sleep(5)
        print "Hello"

    def hello_helper(self, widget, data=None):
        print "starting new thread"
        threading.Thread(target=self.hello, args=(widget, data)).start()

    def main(self):
        """
            This function starts GTK drawing the GUI and responding to events
            like button clicks
        """

        gtk.main()

    def destroy(self, widget, data=None):
        """
            This function exits the application when the window is closed.
            Without this the GTK main thread would continue running while no
            interface would be displayed. We want the application to exit when
            the window is closed, so we tell the GTK loop to stop so we can
            quit.
        """

        gtk.main_quit()

if __name__ == "__main__":
    # Create an instance of our GTK application
    app = HelloWorld()
    gtk.gdk.threads_enter()
    app.main()
    gtk.gdk.threads_leave()