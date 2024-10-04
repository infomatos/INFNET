plugins {
    id("java")
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
        testImplementation(platform("org.junit:junit-bom:5.10.0"))
        testImplementation("org.junit.jupiter:junit-jupiter")
        implementation ("com.fasterxml.jackson.core:jackson-databind:2.15.0")
        implementation ("com.sparkjava:spark-core:2.9.4")
        implementation ("org.projectlombok:lombok:1.18.28")
        implementation ("org.modelmapper:modelmapper:3.1.1")
        annotationProcessor ("org.projectlombok:lombok:1.18.28")
        implementation ("com.google.code.gson:gson:2.10.1")
        testImplementation ("junit:junit:4.13.2")
        implementation ("org.json:json:20171018")

    compileOnly("org.projectlombok:lombok:1.18.34")
    annotationProcessor("org.projectlombok:lombok:1.18.34")
    implementation("com.fasterxml.jackson.core:jackson-databind:2.17.2")
    implementation("org.json:json:20090211")
    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")


        testImplementation ("org.junit.jupiter:junit-jupiter-api:5.7.1")
        testRuntimeOnly ("org.junit.jupiter:junit-jupiter-engine:5.7.1")
}

tasks.test {
    useJUnitPlatform()
}