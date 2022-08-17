import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  app.get( "/filteredimage/", async( req: Request, res: Response ) => {
    // destruct our path query
    let { image_url }: {image_url:string} = req.query;

    // validate the image_url query
    if (!image_url) { 
      // respond with an error iamge_url is not set
      return res.status(400).send(`image url is required`);
    }

    // call filterImageFromURL(image_url) to filter the image
    let filteredImagePath: string;
    try{
      filteredImagePath = await filterImageFromURL(image_url);
    }
    catch(err){
        // respond unprocessable entity if image cannot be processed
        return res.status(422).send(err);
    }
  
    //send the resulting file in the response
    return res.status(200).sendFile(filteredImagePath, () => {
      //delete any files on the server on finish of the response
      deleteLocalFiles([filteredImagePath]);
    });
    
  } );

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();