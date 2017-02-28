package umm3601.todo;

import com.mongodb.MongoClient;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoIterable;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.model.Projections;

import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;

import java.io.IOException;
import java.util.*;

import static com.mongodb.client.model.Filters.eq;

public class TodoController {

    private final MongoCollection<Document> todoCollection;

    public TodoController() throws IOException {
        // Set up our server address
        // (Default host: 'localhost', default port: 27017)
        // ServerAddress testAddress = new ServerAddress();

        // Try connecting to the server
        //MongoClient mongoClient = new MongoClient(testAddress, credentials);
        MongoClient mongoClient = new MongoClient(); // Defaults!

        // Try connecting to a database
        MongoDatabase db = mongoClient.getDatabase("test");

        todoCollection = db.getCollection("todos");
    }

    // List todos
    public String listTodos(Map<String, String[]> queryParams) {
        Document filterDoc = new Document();

        if (queryParams.containsKey("owner")) {
            String targetOwner = queryParams.get("owner")[0];
            filterDoc = filterDoc.append("owner", targetOwner);
        }

        if (queryParams.containsKey("status")) {
            boolean targetBool = Boolean.parseBoolean(queryParams.get("status")[0]);
            filterDoc = filterDoc.append("status", targetBool);
        }

        if (queryParams.containsKey("contains")) {
            String targetBody = queryParams.get("contains")[0];
            filterDoc = filterDoc.append("contains", targetBody);
        }

        if (queryParams.containsKey("category")) {
            String targetCat = queryParams.get("category")[0];
            filterDoc = filterDoc.append("category", targetCat);
        }

        FindIterable<Document> matchingTodos = todoCollection.find(filterDoc);

        return JSON.serialize(matchingTodos);
    }

    // Get a single todo
    public String getTodo(String id) {
        FindIterable<Document> jsonTodos
                = todoCollection
                .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonTodos.iterator();

        Document todo = iterator.next();

        return todo.toJson();
    }

    private List<String> getData(String field) {
        AggregateIterable<Document> data = todoCollection.aggregate(Arrays.asList(Aggregates.group(field)));
        List<String> result = new ArrayList<>();

        for(Document document: data){
            result.add(document.getString("_id"));
        }

        return result;
    }

    private Document categoriesCompelete(List<String> categories){
        Document result = new Document();

        for(String category: categories){
            result.append(category, (float)completeField("category", category)/ todoCollection.count(eq("category", category)));
        }

        return result;
    }

    private Document ownersCompelete(List<String> owners){
        Document result = new Document();

        for(String owner: owners){
            result.append(owner, (float)completeField("owner", owner)/ todoCollection.count(eq("owner", owner)));
        }

        return result;
    }

    private long completeField(String fields, String val){
        Document countDoc = new Document();
        countDoc.append(fields, val);
        countDoc.append("status", true);
        return todoCollection.count(countDoc);
    }

    public String todoSummary() {
        Document container = new Document();
        double totalPercent = (double) todoCollection.count(eq("status",true)) / todoCollection.count();

        List<String> categoryList = getData("$category");
        List<String> ownerList = getData("$owner");
        container.append("percentageTodosComplete", totalPercent);
        container.append("categoriesPercentComplete", categoriesCompelete(categoryList));
        container.append("ownersPercentComplete", ownersCompelete(ownerList));

        return JSON.serialize(container);
    }

    // Get the average age of all todos by company
    public String getAverageAgeByCompany() {
        AggregateIterable<Document> documents
                = todoCollection.aggregate(
                Arrays.asList(
                        Aggregates.group("$company",
                                Accumulators.avg("averageAge", "$age")),
                        Aggregates.sort(Sorts.ascending("_id"))
                ));
        System.err.println(JSON.serialize(documents));
        return JSON.serialize(documents);
    }

}