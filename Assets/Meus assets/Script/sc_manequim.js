#pragma strict

var animadorleg:GameObject;
var animadorarm:GameObject;

var skinpart:Transform[];
var shirtpart:Transform[];
var bearpos:Transform;

function Start ()
{
	animadorleg.animation["standing"].speed = 0.2;
}