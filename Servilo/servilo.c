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
int sendFile(int sock,char *type,char *fileName);
int sendParsedXML(int sock, char *identifier);

int main(){
  puts("Remember predation or starvation, and that other worksheet");
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
      
      //if (strcmp(address,"/")==0){
      //printf("Okay, the address was /\n");
      //sendFile(sock,"text/html","Javascript Client/index.html");
      //} else if (strcmp(address,"/index.html")==0){
      //printf("Okay, the address was /index.html\n");
      //sendFile(sock,"text/html","Javascript Client/index.html");
      //} else if (strcmp(address,"/index.js")==0){
      //printf("Okay, the address was /index.js\n");
      //sendFile(sock,"text/javascript","Javascript Client/index.js");
      //} else if (strcmp(address,"/index.css")==0){
      //printf("Okay, the address was /index.css\n");
      //sendFile(sock,"text/css","Javascript Client/index.css");} else
      if (strcmp(address,"/index.xml")==0){
	puts("The address was /index.xml. Now sending the file");
        sendFile(sock,"text/xml","kopokuneko/index.xml");
      } else {
	puts("Okay, let's send some parsed XML");
        sendParsedXML(sock, address);
	puts("Parsed XML sent!");
      }
    } else {
      message = "Okay, it looks like this isn't a get request. Hello, kind client! I don't understand!";
      write(sock , message , strlen(message)+1);
      close(sock);
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

int sendFile(int sock,char *type,char *fileName){
  //puts("Okay, the function runs. We're off to a good start!");
  int fileLength=0;
  char *loc;
  char *generic_header = malloc(strlen("HTTP/1.0 200 OK\nContent-Type: \n")+strlen(type)+1);
  *generic_header = (char)'\0';
  strcat(generic_header,"HTTP/1.0 200 OK\nContent-Type: ");
  //puts("Added generic header and variables...");
  strcat(generic_header,type);
  //puts("Adding \\0 to header...");
  strcat(generic_header,"\0");
  //puts("Type and \\n and \\0 added to header.");
  //printf("Okay, the address was %s\n",fileName);
  FILE *file = fopen(fileName,"r");
  //FILE *fileLoc=file;
  while (1){
    fgetc(file);
    if (feof(file)){
      break;
    }
    fileLength++;
  }
  fseek(file,0l,0);
  char *fileContents = malloc(fileLength);
  *fileContents = (char)'\0';
  int j;
  for (j=0;j<=fileLength;j++){
    loc=fileContents+j;
    *loc = fgetc(file);
  }
  *(fileContents+j-1) = (char)'\0';
  //printf("File contents:\n%s\n",fileContents);
  int intContentLength=strlen(fileContents);
  j=0;
  do {
    j++;
  } while ((intContentLength/=10)>0);
  char *contentLength = malloc(j);
  intContentLength=strlen(fileContents);
  itoa(intContentLength,contentLength);
  char *message = malloc(strlen(generic_header)+fileLength+strlen(contentLength)+strlen("Content-Length: \n\n\n"));
  *message = (char)'\0';
  //printf("message length: %d\n. message: %s\n",(int)strlen(message),message);
  //printf("Generic Header: %s\n",generic_header);
  //puts("Well, the printf finished...");
  strcat(message,generic_header);
  //puts("generic_header added to message");
  //free(generic_header);
  strcat(message,"\nContent-Length: ");
  strcat(message,contentLength);
  //free(contentLength);
  strcat(message,"\n\n");
  //puts("Content Length added to message");
  //printf("Message is currently:\n%s",message);
  strcat(message,fileContents);
  //puts("Freeing fileContents");
  free(fileContents);
  //puts("File contents added to message");
  //printf("Message is currently:\n%s",message);
  //puts("Adding \\0 to message...");
  *(message+strlen(message))=(char)'\0';
  //puts("\0 added to message");
  //printf("Message: %s",message);
  write(sock , message , strlen(message));
  free(message);
  fclose(file);
  close(sock);
  return(0);
}

int sendParsedXML(int sock, char *identifier){
  puts("sendParsedXML was called!");

  int j=0;
  char *i=identifier;
  char *ip;
  char *loc;
  long index;
  char *type = "kopokunekujo";
  char *treePath;
  char *rFN;
  int fileLength=0;
  mxml_node_t *tree = NULL;
  char *filePath = malloc(strlen("kopokuneko/index.xml")+1);
  strcat(filePath,"kopokuneko/index.xml");

  char *directory = malloc(strlen("kopokuneko")+1);
  *directory = (char)'\0';
  strcat(directory,"kopokuneko\0");


  
  while (*i!='\0'&&*i!=' '){
    j=0;
    ip=i;
    fileLength=0;
    printf("Identifier: %s\n",identifier);
    puts("Okay...");
    do {
      j++; //The length is longer
      i++; //Go to next char
    } while (*i!='/'&&*i!='\n'&&*i!='\0');
    i=ip;

    //printf("j: %d\n",j);
    char *desieroNomo=malloc(j+1);
    *desieroNomo='\0';

    i++;
    loc=desieroNomo;
    do {
      *loc=*i;
      loc++;
      i++; //Go to next char
    } while (*i!='/'&&*i!='\n'&&*i!='\0');
    *loc='\0';
    printf("desieroNomo: %s.\n",desieroNomo);
    //index = strtol(fileName,NULL,36);
    //At this point, we have the next filename. Let's start parsing it!
    printf("Filepath: %s.\n",filePath);
    FILE *file;
    if ((file = fopen(filePath,"r"))!=NULL){
      puts("desiero trovis");
    } else {
      puts("ne desiero trovis");
      return(1);
    }
    while (1){
      fgetc(file);
      if (feof(file)){
	break;
      }
      fileLength++;
    }
    puts("FileLength calculated");
    fseek(file,0,SEEK_SET);
    char *fileContents = malloc(fileLength);
    *fileContents = (char)'\0';
    int j;
    for (j=0;j<=fileLength;j++){
      loc=fileContents+j;
      *loc = fgetc(file);
    }
    *(fileContents+j-1) = (char)'\0';
    printf("File contents:\n%s\n",fileContents);
  
    fseek(file,0,SEEK_SET);
    //mxmlLoadFile(NULL,desiero,MXML_TEXT_CALLBACK);
    puts("Tio funciis");
    
    if ((tree = mxmlLoadFile(NULL,file,MXML_TEXT_CALLBACK))==NULL){
      puts("desiero ne eksistas!");
      return(1);
    }

    puts("tree funciis");
    
    printf("The path returned is %s.\n",(char *) mxmlFindElement(tree,tree,"data",NULL,NULL,MXML_DESCEND));
    printf("Tree: %s\n---\n",mxmlSaveAllocString(tree,MXML_NO_CALLBACK));
    type = (char *) mxmlElementGetAttr(mxmlFindElement(tree,tree,"data",NULL,NULL,MXML_DESCEND),"type");
    printf("Type: %s.\n",type);

    if(strcmp(type,"kopokunekujo")==0){
      puts("The type is \"kopokunekujo\"");
      //Find post directory
      
      printf("Attribute: %s\n",mxmlElementGetAttr(
			mxmlFindElement(
					tree,tree,"post","identifier",desieroNomo,MXML_DESCEND),
			"loc"));
      puts("That worked");
      //return(0);
      int len = (int) strlen((char *)mxmlElementGetAttr(mxmlFindElement(tree,tree,"post","identifier",desieroNomo,MXML_DESCEND),"loc"));
      puts("That worked");

      printf("Strlen: %d\n",len);
      puts("That worked");
      
      rFN=malloc(len+1);
      puts("Malloc worked");
      
      rFN=(char *)mxmlElementGetAttr(mxmlFindElement(tree,tree,"post","identifier",desieroNomo,MXML_DESCEND),"loc");
      printf("length of rFN: %d\n",(int)strlen(rFN));
      puts("Created rFN\n");
      char *tmp = (char*) realloc(directory, (strlen(directory)+strlen(rFN)));
      if (tmp==NULL){
	puts("Fatal error!!!");
	exit(1);
      } else {
	puts("Success");
	directory=tmp;
	free(tmp);
      }
      printf("RFN: %s.\n",rFN);
      puts("Reallocated directory\n");
      strcat(directory,rFN);
      free(rFN);
      puts("Added rFN to directory\n");
      printf("directory: %s.\n",directory);
    }
    
    //printf("Index: %ld\n",index);

    free(desieroNomo);
    mxmlDelete(tree);
    tree=NULL;
    puts("Tree deleted");
    //printf("Tree: %s.\n",tree);
    fseek(file,0,SEEK_SET);
    fclose(file);
    file=NULL;
  }

  puts("The loop ended!");

  //Okay, now we should have the info of the file or subreddit.
  //load XML
  
  

  puts("Closing file and soc...");
  puts("File closed");
  close(sock);
  puts("Sock closed");
  return 0;
  puts("WTF, why is this running?!?!");
}
