#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <netdb.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#define MSGSZ 2000

void *connectionHandler(void *);

int main(){
  int socketdesc = socket(AF_INET, SOCK_STREAM, 0);
  int connectionSocketDesc,*conSock,*new_sock,new_socket;
  char *message , server_reply[MSGSZ];
  struct sockaddr_in server, client;
  server.sin_addr.s_addr = INADDR_ANY;
  server.sin_family = AF_INET;
  server.sin_port = htons(8888);
  puts("Binding...");
  if (bind(socketdesc,(struct sockaddr *)&server,sizeof(server)) < 0){
    puts("Bind failed!");
    return 1;
  }
  if (listen(socketdesc,3)<0){
    puts("Listening failed");
    return 1;
  }

  puts("Listening Successfull! Waiting for incoming connections...");

  int c = sizeof(struct sockaddr_in);

  while ( (connectionSocketDesc = accept(socketdesc, (struct sockaddr *)&client, (socklen_t*)&c))){
    pthread_t sniffer_thread;
    conSock = malloc(1);
    *conSock = connectionSocketDesc;

    if (pthread_create( &sniffer_thread, NULL, connectionHandler, (void*) conSock)<0){
      perror("Could not create thread :(. Closing.");
      return 1;
    }
    //pthread_join(sniffer_thread, NULL);
  }

  
  if (connectionSocketDesc<0){
    perror("Accept failed");
    close(socketdesc);
    return 1;
  }

  close(socketdesc);
  
  return 0;
}

/* void *connectionHandler(void *socket_desc){ */
/*   int sock =  *(int*)socket_desc; */

/*   char *message; */

/*   message = "Hello internet :D\n"; */
/*   write(sock, message, strlen(message)); */

/*   free(socket_desc); */
/*   return 0; */
/* } */

void *connectionHandler(void *socket_desc) {
	//Get the socket descriptor
	int sock = *(int*)socket_desc;
	
	char *message;
        
	message = "Hello :D\n";
	write(sock, message, strlen(message));
	
	//Free the socket pointer
	free(socket_desc);
	
	return 0;
}