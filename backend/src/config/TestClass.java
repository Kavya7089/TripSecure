/* IMPORTANT: Multiple classes and nested static classes are supported */

/*
 * uncomment this if you want to read input.
//imports for BufferedReader
import java.io.BufferedReader;
import java.io.InputStreamReader;

//import for Scanner and other utility classes
import java.util.*;
*/

// Warning: Printing unwanted or ill-formatted data to output will cause the test cases to fail
import java.util.Scanner;
class TestClass {
    private static char getClosestPrime(int asciiValue, int [] primes){
        char closest = (char) primes[0];
        int minDiff= Math.abs(asciiValue-primes[0]);
        for(int i =1; i<primes.length;i++){
            int diff= Math.abs(asciiValue-primes[i]);
            if(diff< minDiff || (diff== minDiff && primes[i]< (int) closest)){
                minDiff=diff;
                closest = (char) primes[i];
            }
        }
        return closest;
    }
    public static void main(String args[] ) throws Exception {
 
        Scanner sc = new Scanner(System.in);
        int t=sc.nextInt();
        int [] primes={67,71,73,79,83,89,97,101,103, 107 ,109,113};

        while(t-- >0){
            int n= sc.nextInt();
            String s= sc.next();
            StringBuilder result = new StringBuilder();
            for(int i =0;i<n;i++){
                char currentChar= s.charAt(i);
                int asciiValue = (int) currentChar;
                char closestChar = getClosestPrime(asciiValue, primes);
                 result.append(closestChar);
            }
            System.out.println(result.toString());
        }
        sc.close();
    }
}