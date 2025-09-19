clear:
	rm *.o

hello:
	@echo '你好'


main.o:
	gcc -c main.c

b.o:
	gcc -c b.c


bulid: main.o b.o
	gcc main.o b.o -o app.out -lm
	rm *.o

run: app.out

	./app.out