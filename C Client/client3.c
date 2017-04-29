#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <netdb.h>
#include <string.h>
#include <stdio.h>
#define MSGSZ 2000

int main(){
  int socketdesc = socket(AF_INET, SOCK_STREAM, 0);
  char *message , server_reply[MSGSZ];
  struct sockaddr_in server;
  server.sin_addr.s_addr = inet_addr("127.0.0.1");
  server.sin_family = AF_INET;
  server.sin_port = htons(8888);
  puts("Connecting...");
  if (connect(socketdesc,(struct sockaddr *)&server,sizeof(server)) < 0){
    puts("Connect failed!");
    return 1;
  }
  puts("Connected");
  puts("Sending Data, YOLO!");
  message = "GET /index.js HTTP/1.1\r\n\r\n";
  if (send(socketdesc,message,strlen(message),0)<0){
    puts("Oh no! Something went wrong sending the data D:. Quiting!");
    return 1;
  }
  printf("Now it's time to listen and recieve some data! %d array, YOLO!\n",MSGSZ);
  if (recv(socketdesc,server_reply,MSGSZ,0)<0){
    printf("Okay, umm... this isn't good. It appears that the recieve command failed for some reason. Bye... :(");
  }
  close(socketdesc);
  puts("Reply recieved, YOLO :D");
  puts(server_reply);
  return 0;
}
