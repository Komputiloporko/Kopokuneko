#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <netdb.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <mxml.h>
#include <string.h>
#define MSGSZ 2000

void *connectionHandler(void *);
void reverse(char s[]);
void itoa(int n, char s[]);

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
    pthread_join(sniffer_thread, NULL);
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

void *connectionHandler(void *socket_desc){
  //Get the socket descriptor
  int sock = *(int*)socket_desc;
  int read_size;
  char *message , client_message[2000];
  char *i;
  int j,n;
  int requestLength=0;
  int addressLength=-1;
  int fileLength=0;
  char *loc;
  FILE *fileLoc;
  char *address;
  char *header;
  char *generic_header = "HTTP/1.0 200 OK\nContent-Type: text/html\nAccess-Control-Allow-Credentials: true";
  char *contentLength;
  int intContentLength;
  char *requestHeader;
  char *fileContents;
        
  //Receive a message from client
  while( (read_size = recv(sock , client_message , 2000 , 0)) > 0){
    //puts(client_message);
    //for (i=client_message;i<client_message+strlen(client_message);i++){
      //printf("%c",*i);
    //}

    int requestLength=0;
    for (i=client_message;(i<client_message+strlen(client_message))&& *i != ' ';i++){
      requestLength++;
    }
    //printf("Request Length: %d\n",requestLength);
    //printf("Client message: %s\n",client_message);
    free(requestHeader);
    char *requestHeader = malloc(requestLength+1);
    
    for (j=0; j<requestLength;j++){
      i=client_message+j;
      loc=requestHeader+j;
      *loc=*i;
    }
    *(loc+1)='\0';
    //printf("Length of requestHeader: %d\n",(int)strlen(requestHeader));
    //printf("%s\n",requestHeader);

    if (strcmp(requestHeader, "GET")==0){
      int addressLength = -1;
      for (i=client_message+requestLength+1;(i<client_message+strlen(client_message))&& *i != ' ';i++){
	addressLength++;
      }

      free(address);
      //printf("%d",addressLength);
      char *address = malloc(addressLength+1);

      for (j=0;j<=addressLength;j++){
	i=client_message+requestLength+1+j;
	loc=address+j;
	*loc=*i;
      }
      *(loc+1)='\0';
      
      
      //printf("The address: %s...\n",address);
      
      if (strcmp(address,"/")==0){
	char *generic_header = "HTTP/1.0 200 OK\nContent-Type: text/html\nAccess-Control-Allow-Credentials: true";
	//printf("Okay, the address was /\n");
	FILE *file = fopen("Javascript Client/index.html","r");
	fileLoc=file;
	while (1){
	  fgetc(file);
	  if (feof(file)){
	    break;
	  }
	  fileLength++;
	}
	fseek(file,0l,0);
	free(fileContents);
	char *fileContents = malloc(fileLength);
	
	for (j=0;j<=fileLength;j++){
	  loc=fileContents+j;
	  *loc = fgetc(file);
	}
	free(message);
	free(contentLength);
	intContentLength=strlen(fileContents);
	j=0;
	do {
	  j++;
	} while ((intContentLength/=10)>0);
	free(contentLength);
	char *contentLength = malloc(j);
	intContentLength=strlen(fileContents);
        itoa(intContentLength,contentLength);
	free(message);
	char *message = malloc(strlen(generic_header)+fileLength+strlen(contentLength)+strlen("Content-Length: \n\n\n")+1);
	*message = (char)'\0';
	//printf("message length: %d\n. message: %s\n",(int)strlen(message),message);
	//printf("Generic Header: %s\n",generic_header);
	//puts("Well, the printf finished...");
	strcat(message,generic_header);
	//puts("generic_header added to message");
	strcat(message,"\nContent-Length: ");
	strcat(message,contentLength);
	strcat(message,"\n\n");
	//puts("Content Length added to message");
	strcat(message,fileContents);
	//puts("File contents added to message");
	strcat(message,"\0");
	//puts("\0 added to message");
	//printf("Message: %s",message);
	write(sock , message , strlen(message)-1);
	fclose(file);
	close(sock);
      } else if (strcmp(address,"/index.html")==0){
	char *generic_header = "HTTP/1.0 200 OK\nContent-Type: text/html\nAccess-Control-Allow-Credentials: true";
	//printf("Okay, the address was /index.html\n");
	FILE *file = fopen("Javascript Client/index.html","r");
	fileLoc=file;
	while (1){
	  fgetc(file);
	  if (feof(file)){
	    break;
	  }
	  fileLength++;
	}
	fseek(file,0l,0);
	free(fileContents);
	char *fileContents = malloc(fileLength);
	
	for (j=0;j<=fileLength;j++){
	  loc=fileContents+j;
	  *loc = fgetc(file);
	}
	free(message);
	free(contentLength);
	intContentLength=strlen(fileContents);
	j=0;
	do {
	  j++;
	} while ((intContentLength/=10)>0);
        free(contentLength);
	char *contentLength = malloc(j);
	intContentLength=strlen(fileContents);
        itoa(intContentLength,contentLength);
	free(message);
	char *message = malloc(strlen(generic_header)+fileLength+strlen(contentLength)+strlen("Content-Length: \n\n\n")+1);
	*message = (char)'\0';
	//printf("message length: %d\n. message: %s\n",(int)strlen(message),message);
	//printf("Generic Header: %s\n",generic_header);
	//puts("Well, the printf finished...");
	strcat(message,generic_header);
	//puts("generic_header added to message");
	strcat(message,"\nContent-Length: ");
	strcat(message,contentLength);
	strcat(message,"\n\n");
	//puts("Content Length added to message");
	strcat(message,fileContents);
	//puts("File contents added to message");
	strcat(message,"\0");
	//puts("\0 added to message");
	//printf("Message: %s",message);
	write(sock , message , strlen(message)-1);
	fclose(file);
	close(sock);
      } else if (strcmp(address,"/index.js")==0){
	char *generic_header = "HTTP/1.0 200 OK\nContent-Type: text/javascript\nAccess-Control-Allow-Credentials: true";
	//printf("Okay, the address was /index.js\n");
	FILE *file = fopen("Javascript Client/index.js","r");
	fileLoc=file;
	while (1){
	  fgetc(file);
	  if (feof(file)){
	    break;
	  }
	  fileLength++;
	}
	fseek(file,0l,0);
	free(fileContents);
	char *fileContents = malloc(fileLength);
	
	for (j=0;j<=fileLength;j++){
	  loc=fileContents+j;
	  *loc = fgetc(file);
	}
	*(fileContents+j)=(char)'\0';
	free(message);
	free(contentLength);
	intContentLength=strlen(fileContents);
	j=0;
	do {
	  j++;
	} while ((intContentLength/=10)>0);
	free(contentLength);
	char *contentLength = malloc(j);
	intContentLength=strlen(fileContents);
        itoa(intContentLength,contentLength);
	free(message);
	char *message = malloc(strlen(generic_header)+fileLength+strlen(contentLength)+strlen("Content-Length: \n\n\n")+1);
	*message = (char)'\0';
	//printf("message length: %d\n. message: %s\n",(int)strlen(message),message);
	//printf("Generic Header: %s\n",generic_header);
	//puts("Well, the printf finished...");
	strcat(message,generic_header);
	//puts("generic_header added to message");
	strcat(message,"\nContent-Length: ");
	strcat(message,contentLength);
	strcat(message,"\n\n");
	//puts("Content Length added to message");
	strcat(message,fileContents);
	//puts("File contents added to message");
	strcat(message,"\0");
	//puts("\0 added to message");
	//printf("Message: %s",message);
	write(sock , message , strlen(message)-1);
	fclose(file);
	close(sock);
      } else if (strcmp(address,"/index.css")==0){
	char *generic_header = "HTTP/1.0 200 OK\nContent-Type: text/css\nAccess-Control-Allow-Credentials: true";
	//printf("Okay, the address was /index.css\n");
	FILE *file = fopen("Javascript Client/index.css","r");
	fileLoc=file;
	while (1){
	  fgetc(file);
	  if (feof(file)){
	    break;
	  }
	  fileLength++;
	}
	fseek(file,0l,0);
	free(fileContents);
	char *fileContents = malloc(fileLength);
	*fileContents = (char)'\0';
	for (j=0;j<=fileLength;j++){
	  loc=fileContents+j;
	  *loc = fgetc(file);
	}
	*(fileContents+j)=(char)'\0';
	//printf("\n\nFile Contents:\n%s\n\n",fileContents);
	free(message);
	free(contentLength);
	intContentLength=strlen(fileContents);
	j=0;
	do {
	  j++;
	} while ((intContentLength/=10)>0);
	free(contentLength);
	char *contentLength = malloc(j);
	intContentLength=strlen(fileContents);
        itoa(intContentLength,contentLength);
	free(message);
	char *message = malloc(strlen(generic_header)+fileLength+strlen(contentLength)+strlen("Content-Length: \n\n\n")+1);
	*message = (char)'\0';
	//printf("message length: %d\n. message: %s\n",(int)strlen(message),message);
	//printf("Generic Header: %s\n",generic_header);
	//puts("Well, the printf finished...");
	strcat(message,generic_header);
	//puts("generic_header added to message");
	strcat(message,"\nContent-Length: ");
	strcat(message,contentLength);
	strcat(message,"\n\n");
	//puts("Content Length added to message");
	strcat(message,fileContents);
	//puts("File contents added to message");
	//printf("Message: %s",message);
	strcat(message,"\0");
	//puts("0 added to message");
	//printf("Message: %s",message);
	write(sock , message , strlen(message)-1);
	fclose(file);
	close(sock);
      } else if (strcmp(address,"/index.xml")==0){
	char *generic_header = "HTTP/1.0 200 OK\nContent-Type: text/xml\nAccess-Control-Allow-Credentials: true";
	//printf("Okay, the address was /index.xml\n");
	FILE *file = fopen("kopokuneko/index.xml","r");
	fileLoc=file;
	while (1){
	  fgetc(file);
	  if (feof(file)){
	    break;
	  }
	  fileLength++;
	}
	fseek(file,0l,0);
	free(fileContents);
	char *fileContents = malloc(fileLength);
	
	for (j=0;j<=fileLength;j++){
	  loc=fileContents+j;
	  *loc = fgetc(file);
	}
	free(message);
	free(contentLength);
	intContentLength=strlen(fileContents);
	j=0;
	do {
	  j++;
	} while ((intContentLength/=10)>0);
	free(contentLength);
	char *contentLength = malloc(j);
	intContentLength=strlen(fileContents);
        itoa(intContentLength,contentLength);
	free(message);
	char *message = malloc(strlen(generic_header)+fileLength+strlen(contentLength)+strlen("Content-Length: \n\n\n")+1);
	*message = (char)'\0';
	//printf("message length: %d\n. message: %s\n",(int)strlen(message),message);
	//printf("Generic Header: %s\n",generic_header);
	//puts("Well, the printf finished...");
	strcat(message,generic_header);
	//puts("generic_header added to message");
	strcat(message,"\nContent-Length: ");
	strcat(message,contentLength);
	strcat(message,"\n\n");
	//puts("Content Length added to message");
	strcat(message,fileContents);
	//puts("File contents added to message");
	strcat(message,"\0");
	//puts("\0 added to message");
	//printf("Message: %s",message);
	write(sock , message , strlen(message)-1);
	fclose(file);
	close(sock);
      } else {
	//printf("It was not /");
	message = "HTTP/1.0 404 Not Found\nContent-Type: text/html\nConnection:close\nAccess-Control-Allow-Credentials: true\n\n<html><body><h1>404: Not Found</h1></body></html>";
	write(sock , message , strlen(message)+1);
	close(sock);
      }
    } else {
      message = "Okay, it looks like this isn't a get request. Hello, kind client! I don't understand!";
      write(sock , message , strlen(message)+1);
    }
  }
	
  if(read_size == 0){
    //puts("Client disconnected");
    fflush(stdout);
  }
  else if(read_size == -1){
    //perror("recv failed");
  }

  //Free the socket pointer
  free(socket_desc);
	
  return 0;
}

/* itoa:  convert n to characters in s */
void itoa(int n, char s[])
{
  int i, sign;

  if ((sign = n) < 0)  /* record sign */
    n = -n;          /* make n positive */
  i = 0;
  do {       /* generate digits in reverse order */
    s[i++] = n % 10 + '0';   /* get next digit */
  } while ((n /= 10) > 0);     /* delete it */
  if (sign < 0)
    s[i++] = '-';
  s[i] = '\0';
  reverse(s);
}

/* reverse:  reverse string s in place */
void reverse(char s[])
{
    int i, j;
    char c;

    for (i = 0, j = strlen(s)-1; i<j; i++, j--) {
        c = s[i];
        s[i] = s[j];
        s[j] = c;
    }
}
